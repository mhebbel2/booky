export interface ReaderTheme {
  id: string
  label: string
  /** Colors for the app chrome around the book */
  chrome: { bg: string; text: string; border: string; subtle: string }
  /** Styles injected into the rendition iframe (!important beats book CSS) */
  body: { color: string; background: string }
  swatch: string
}

export const THEMES: ReaderTheme[] = [
  {
    id: 'light',
    label: 'Light',
    chrome: { bg: '#fafaf9', text: '#1c1917', border: '#e7e5e4', subtle: '#78716c' },
    body: { color: '#1c1917 !important', background: '#fafaf9 !important' },
    swatch: '#fafaf9',
  },
  {
    id: 'sepia',
    label: 'Sepia',
    chrome: { bg: '#f3ead8', text: '#433422', border: '#e0d3b8', subtle: '#8a7458' },
    body: { color: '#433422 !important', background: '#f3ead8 !important' },
    swatch: '#f3ead8',
  },
  {
    id: 'dark',
    label: 'Dark',
    chrome: { bg: '#1c1917', text: '#e7e5e4', border: '#44403c', subtle: '#a8a29e' },
    body: { color: '#e7e5e4 !important', background: '#1c1917 !important' },
    swatch: '#1c1917',
  },
]

export function getTheme(id: string): ReaderTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
