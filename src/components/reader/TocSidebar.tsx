import { X } from 'lucide-react'
import type { ReaderTheme } from '../../lib/themes'

export interface TocEntry {
  id: string
  href: string
  label: string
  depth: number
}

interface Props {
  toc: TocEntry[]
  open: boolean
  theme: ReaderTheme
  /** Spine href of the page currently being read */
  currentHref: string | null
  onClose: () => void
  onSelect: (href: string) => void
}

export default function TocSidebar({ toc, open, theme, currentHref, onClose, onSelect }: Props) {
  return (
    <>
      {open && <div className="absolute inset-0 z-20 bg-black/30" onClick={onClose} />}
      <aside
        className={`absolute inset-y-0 left-0 z-30 flex w-80 max-w-[85vw] flex-col border-r shadow-xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: theme.chrome.bg, borderColor: theme.chrome.border }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: theme.chrome.border }}
        >
          <span className="text-sm font-semibold">Contents</span>
          <button
            onClick={onClose}
            aria-label="Close table of contents"
            className="rounded-lg p-1 transition hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto py-2">
          {toc.length === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: theme.chrome.subtle }}>
              No table of contents.
            </p>
          )}
          {toc.map((item) => {
            // TOC hrefs may carry a #fragment; the current href never does.
            const isCurrent = item.href.split('#')[0] === currentHref
            return (
              <button
                key={`${item.id}:${item.href}`}
                onClick={() => onSelect(item.href)}
                className={`block w-full truncate py-2 pr-4 text-left text-sm transition hover:opacity-70 ${
                  isCurrent ? 'font-semibold text-amber-600' : ''
                }`}
                style={{ paddingLeft: `${1 + item.depth * 1.25}rem` }}
              >
                {item.label || 'Untitled'}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
