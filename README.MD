# Source Maps Parser  
_Companion code for my blog post on using Source Maps for better debugging._  

## Overview  
This repository contains code demonstrating how to **parse minified stack traces using Source Maps**, as covered in my blog post:  

📖 **Read the full post here** → https://dev.to/itaybenami/how-i-leveraged-source-maps-to-improve-my-teams-debugging-2a6f-temp-slug-22424?preview=7a46d3130a0443c834964fbbb165ab5c1854e9d20141762369f7660df1b911058416d3f8d877133f5ef84f62ba4cc089ed3d75a8897ffd9578c7b2e6  

The project includes:  
- **`my-app/`** → A sample Vite + React app, demonstrating how Source Maps work.  
- **`my-app/dist/`** → A pre-built production version of `my-app`, including Source Maps for illustration.  
- **`sourceMaps.ts`** → Loads Source Maps into memory and resolves stack traces back to original source files.  

---

## Installation

1. Clone the repository:
 ```bash
 git clone https://github.com/ItayBen-Ami/source-maps-parser
 cd source-maps-parser
 ```
2. Install dependencies for both parser and client:
```bash
npm install && cd my-app && npm install && cd ..
```

## Running the App

You can either grab the code in ``sourceMaps.ts`` for your own projects or play around with this repo. To try it out: 
1. Generate an error in the client. 
2. Run vite in preview mode:
    ```bash
    cd my-app && npm run build && npm run preview
    ```
You can then grab the error and parse the message and stack trace using the ``parseStackTrace`` function in ``sourceMaps.ts``.
