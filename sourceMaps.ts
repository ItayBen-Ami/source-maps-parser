import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import StackTrace from 'stacktrace-js';
import { SourceMapConsumer } from 'source-map-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceMapsPath = path.resolve(__dirname, './my-app/dist/assets');
const MAX_STACK_TRACE_DEPTH = 5;
const sourceMapConsumers: Record<string, SourceMapConsumer> = {};
const sourceMapResults = {};

export async function parseStackTrace({stack, message = ''}) {
  const error = new Error(message);
  error.stack = stack;

  const stackFrames = await StackTrace.fromError(error);
  const parsedFrames: string[] = [];

  for (const frame of stackFrames.slice(0, MAX_STACK_TRACE_DEPTH)) {
    try {
      const sourceMapFilePath = path.join(sourceMapsPath, `${path.basename(frame?.fileName ?? '')}.map`);
      const consumer = sourceMapConsumers[path.basename(sourceMapFilePath)];

      if (consumer) {
        let originalPosition = sourceMapResults[`${sourceMapsPath}${frame.lineNumber}${frame.columnNumber}`];

        if (!originalPosition) {
          originalPosition = consumer.originalPositionFor({
            line: frame.lineNumber as number,
            column: frame.columnNumber as number,
          });
          sourceMapResults[`${sourceMapsPath}${frame.lineNumber}${frame.columnNumber}`] = originalPosition;
        }

        const parsedFrame = ` at ${originalPosition.name ?? ''} (${originalPosition.source}:${originalPosition.line}:${originalPosition.column})`;
        parsedFrames.push(!parsedFrames.length ? `${message} ${parsedFrame}` : parsedFrame);
      }      
    } catch {
      const parsedFrame = ` at ${frame.functionName} (${frame.fileName}:${frame.lineNumber}:${frame.columnNumber})`;
      parsedFrames.push(!parsedFrames.length ? `${message} ${parsedFrame}` : parsedFrame);
    }
  }

  return parsedFrames.length ? parsedFrames.join('\n') : stack;
}

const loadSourceMaps = async () => {
  const sourceMapsDir = await fs.opendir(sourceMapsPath);
  for await (const sourceMapFile of sourceMapsDir) {
    const fileName = sourceMapFile.name;
    if (fileName.includes('.map')) {
      const file = await fs.readFile(path.join(sourceMapsPath, fileName), 'utf-8');
      sourceMapConsumers[fileName] = await new SourceMapConsumer(JSON.parse(file));
    }
  }
};

loadSourceMaps();