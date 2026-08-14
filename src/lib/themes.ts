export interface ReaderTheme {
  id: 'light' | 'dark'
  /** Colors for the app chrome around the book */
  chrome: { bg: string; text: string; border: string; subtle: string }
  /** epub.js theme rules: selector -> declarations injected into the book iframe */
  rules: Record<string, Record<string, string>>
}

/**
 * Real EPUBs set explicit colors on their own elements, which always beat an
 * inherited body color. So a reading theme has to override the common text
 * elements directly (with !important), not just body. Backgrounds are forced
 * transparent so white boxes from book CSS don't survive dark mode.
 */
const TEXT_SELECTORS = [
  'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'li', 'ul', 'ol', 'blockquote', 'pre', 'td', 'th', 'dt', 'dd',
  'em', 'strong', 'b', 'i', 'u', 'small', 'sup', 'sub',
  'figcaption', 'caption', 'section', 'article', 'aside',
  'header', 'footer', 'main', 'label',
].join(', ')

/**
 * Book text renders at the browser default line-height ("normal" ≈ 1.2)
 * unless the book sets its own. Bumping that by 10% gives 1.32; unitless so
 * it scales with the font-size setting.
 */
const LINE_HEIGHT = '1.32'

/**
 * Text size is owned by the browser (e.g. Samsung Internet's text-size
 * setting), which scales text via the text-size-adjust inflation algorithm.
 * Force "auto" so a book's own CSS can't opt out of it.
 */
const TEXT_SIZE_ADJUST: Record<string, string> = {
  '-webkit-text-size-adjust': 'auto !important',
  'text-size-adjust': 'auto !important',
}

function themeRules(text: string, bg: string, link: string): Record<string, Record<string, string>> {
  return {
    body: {
      color: `${text} !important`,
      background: `${bg} !important`,
      ...TEXT_SIZE_ADJUST,
    },
    [TEXT_SELECTORS]: {
      color: `${text} !important`,
      'background-color': 'transparent !important',
      'background-image': 'none !important',
      'line-height': `${LINE_HEIGHT} !important`,
      ...TEXT_SIZE_ADJUST,
    },
    a: {
      color: `${link} !important`,
    },
  }
}

export const THEMES: ReaderTheme[] = [
  {
    id: 'light',
    chrome: { bg: '#fafaf9', text: '#1c1917', border: '#e7e5e4', subtle: '#78716c' },
    rules: themeRules('#1c1917', '#fafaf9', '#b45309'),
  },
  {
    id: 'dark',
    chrome: { bg: '#1c1917', text: '#e7e5e4', border: '#44403c', subtle: '#a8a29e' },
    rules: themeRules('#e7e5e4', '#1c1917', '#f59e0b'),
  },
]

export function getTheme(id: string): ReaderTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
