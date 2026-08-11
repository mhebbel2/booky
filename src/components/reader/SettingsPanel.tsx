import { Minus, Plus } from 'lucide-react'
import type { ReaderTheme } from '../../lib/themes'
import { useSettingsStore } from '../../store/useSettingsStore'

interface Props {
  open: boolean
  theme: ReaderTheme
  onClose: () => void
}

export default function SettingsPanel({ open, theme, onClose }: Props) {
  const { fontSize, setFontSize } = useSettingsStore()

  if (!open) return null

  return (
    <>
      <div className="absolute inset-0 z-20" onClick={onClose} />
      <div
        className="absolute right-3 top-3 z-30 w-64 rounded-xl border p-4 shadow-xl"
        style={{
          background: theme.chrome.bg,
          borderColor: theme.chrome.border,
          color: theme.chrome.text,
        }}
      >
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wide"
          style={{ color: theme.chrome.subtle }}
        >
          Font size
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontSize(Math.max(70, fontSize - 10))}
            aria-label="Decrease font size"
            className="rounded-lg border p-1.5 transition hover:opacity-70"
            style={{ borderColor: theme.chrome.border }}
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm tabular-nums">{fontSize}%</span>
          <button
            onClick={() => setFontSize(Math.min(200, fontSize + 10))}
            aria-label="Increase font size"
            className="rounded-lg border p-1.5 transition hover:opacity-70"
            style={{ borderColor: theme.chrome.border }}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="mt-3 text-xs" style={{ color: theme.chrome.subtle }}>
          Theme follows your system setting.
        </p>
      </div>
    </>
  )
}
