import { ChevronLeft, List } from 'lucide-react'
import type { ReaderTheme } from '../../lib/themes'

interface Props {
  open: boolean
  title: string
  author: string
  percentage: number
  theme: ReaderTheme
  onBack: () => void
  onToggleToc: () => void
}

export default function ReaderMenu({
  open,
  title,
  author,
  percentage,
  theme,
  onBack,
  onToggleToc,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-3 pt-3">
      <div
        role="dialog"
        aria-hidden={!open}
        className={`flex w-full max-w-2xl items-center gap-1 rounded-xl border px-2 py-1.5 shadow-xl backdrop-blur-md transition-all duration-200 ${
          open
            ? 'translate-y-0 opacity-100'
            : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
        style={{ background: theme.chrome.bg, borderColor: theme.chrome.border }}
      >
        <button
          onClick={onBack}
          aria-label="Back to library"
          className="rounded-lg p-2 transition hover:opacity-70"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="truncate text-xs" style={{ color: theme.chrome.subtle }}>
            {author}
          </p>
        </div>
        <span
          className="px-2 text-xs tabular-nums"
          style={{ color: theme.chrome.subtle }}
        >
          {Math.round(percentage * 100)}%
        </span>
        <button
          onClick={onToggleToc}
          aria-label="Table of contents"
          className="rounded-lg p-2 transition hover:opacity-70"
        >
          <List size={20} />
        </button>
      </div>
    </div>
  )
}
