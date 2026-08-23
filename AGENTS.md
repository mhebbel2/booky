# AGENTS.md

Notes for AI agents working in this repo.

## Project

Booky — a local-first EPUB reader. 100% client-side; library and reading
progress live in IndexedDB. Deployed to GitHub Pages on every push to `main`
via `.github/workflows/deploy.yml`.

Stack: Vite · React 18 · TypeScript · epub.js · Dexie (IndexedDB) · Zustand ·
Tailwind CSS · vite-plugin-pwa.

## Commands

There is no separate test or lint script — `npm run build` is the only
verification gate.

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc --noEmit && vite build → dist/
npm run preview   # serve dist/ locally
```

Always run `npm run build` before pushing; the deploy workflow runs the same
command, and a TypeScript error there will fail CI.

## Layout

```
src/
  main.tsx              entry, registers router and PWA service worker
  App.tsx               routes: / (library) and /read/:id
  index.css             Tailwind base
  components/
    library/            library view: import, list, open book
    reader/
      ReaderView.tsx    epub.js viewer + overlay next/prev page buttons
      ReaderToolbar.tsx top chrome inside the reader
      TocSidebar.tsx    table-of-contents drawer
  hooks/                React hooks (epub loading, theme, etc.)
  lib/                  epub helpers, file utilities
  store/                Zustand stores
```

## Conventions

- **TypeScript strictness**: code must typecheck with `tsc --noEmit`. No `any`
  unless there's a clear epub.js interop reason.
- **Styling**: Tailwind utility classes only. No CSS modules. Use
  `className` with utility chains; arbitrary values via `w-[15%]` syntax when
  needed (e.g. the reader's page-tap zones).
- **No code comments**: keep code self-explanatory; do not add explanatory
  comments.
- **State**: ephemeral UI state in React; persistent state in IndexedDB via
  Dexie; cross-component state in Zustand stores under `src/store/`.
- **PWA**: configured in `vite.config.ts`. After touching icons/manifest,
  bump nothing — just rebuild; the service worker is regenerated.
- **Base path**: `vite.config.ts` sets `base: '/booky/'` for production
  builds. Absolute paths in HTML/CSS/manifest must be relative or prefixed
  with that base.

## Reader pagination

The reader has two absolutely-positioned invisible overlay buttons in
`src/components/reader/ReaderView.tsx` that call `rendition.next()` /
`rendition.prev()` on click. Keyboard handlers on `window` and the epub
iframe (ArrowLeft/Right, PageUp/Down, Space) duplicate the same control so
the full window is always paged by keyboard regardless of the tap zones' size.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds with
Node 20 and deploys the `dist/` artifact to GitHub Pages. No manual deploy
step. SSH key for `git@github.com` must be loaded in the local ssh-agent
(`ssh-add -l` should list a key for `mhebbel2`) before `git push`.
