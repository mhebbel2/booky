import { ChevronLeft, List, SlidersHorizontal } from 'lucide-react'
import type { ReaderTheme } from '../../lib/themes'

interface Props {
  title: string
  author: string
  percentage: number
  theme: ReaderTheme
  onBack: () => void
  onToggleToc: () => void
  onToggleSettings: () => void
}

export default function ReaderToolbar({
  title,
  author,
  percentage,
  theme,
  onBack,
  onToggleToc,
  onToggleSettings,
}: Props) {
  return (
    <header
      className="flex items-center gap-1 border-b px-2 py-2 sm:px-4"
      style={{ borderColor: theme.chrome.border }}
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
      <button
        onClick={onToggleSettings}
        aria-label="Reading settings"
        className="rounded-lg p-2 transition hover:opacity-70"
      >
        <SlidersHorizontal size={20} />
      </button>
    </header>
  )
}
