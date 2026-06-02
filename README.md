# GetSetPixel

GetSetPixel is a visual algorithm-learning game inspired by pixel art and programming puzzles. World 1 focuses on pattern generation with a single API: `setPixel(x, y, color)`.

## Stack

- React + TypeScript + Vite
- Monaco Editor
- Pyodide (Python runtime in-browser)
- HTML Canvas rendering
- localStorage persistence

## Setup

```bash
npm install
npm run dev
```

Pyodide assets are copied into `public/pyodide` during `postinstall` for offline-first development. If the assets are missing, re-run:

```bash
npm run postinstall
```

## Development Notes

- World 1 only. No World 2/3 scaffolding.
- Levels live in `src/game/world1Levels.ts`.
- Rendering lives in `src/engine` and `src/components`.
