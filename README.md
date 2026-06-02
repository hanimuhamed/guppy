# GetSetPixel

GetSetPixel is a visual coding puzzle game inspired by pixel art and programming puzzles.

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
