# Booky

A local-first EPUB reader that runs entirely in your browser. No accounts, no
server, no tracking — your books never leave your device.

**[Open Booky](https://mhebbel2.github.io/booky/)**

## Features

- Import EPUBs via file picker or drag-and-drop (multi-file supported)
- Paginated or scrolled reading, adjustable font size, light / sepia / dark themes
- Table of contents, keyboard navigation (arrow keys, Page Up/Down, Space)
- Remembers your position and progress in every book
- Installable PWA — works fully offline
- 100% client-side: library and reading progress live in IndexedDB

## Tech stack

Vite · React 18 · TypeScript · [epub.js](https://github.com/futurepress/epub.js) ·
Dexie (IndexedDB) · Zustand · Tailwind CSS · vite-plugin-pwa

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

The production build in `dist/` is published to GitHub Pages from the
`gh-pages` branch.

## License

[MIT](LICENSE)
