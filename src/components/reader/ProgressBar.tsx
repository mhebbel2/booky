import type { ReaderTheme } from '../../lib/themes'

interface Props {
  percentage: number
  theme: ReaderTheme
}

export default function ProgressBar({ percentage, theme }: Props) {
  const pct = Math.min(100, Math.max(0, percentage * 100))
  return (
    <div className="h-1 w-full" style={{ background: theme.chrome.border }}>
      <div
        className="h-full bg-amber-600 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
