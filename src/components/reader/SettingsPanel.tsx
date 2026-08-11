import { Minus, Plus } from 'lucide-react'
import { THEMES, type ReaderTheme } from '../../lib/themes'
import { useSettingsStore, type ReadingFlow } from '../../store/useSettingsStore'

interface Props {
  open: boolean
  theme: ReaderTheme
  onClose: () => void
}

const FLOWS: ReadingFlow[] = ['paginated', 'scrolled']

export default function SettingsPanel({ open, theme, onClose }: Props) {
  const { fontSize, themeId, flow, setFontSize, setThemeId, setFlow } = useSettingsStore()

  if (!open) return null

  const labelClass = 'mb-2 text-xs font-semibold uppercase tracking-wide'

  return (
    <>
      <div className="absolute inset-0 z-20" onClick={onClose} />
      <div
        className="absolute right-3 top-3 z-30 w-72 rounded-xl border p-4 shadow-xl"
        style={{
          background: theme.chrome.bg,
          borderColor: theme.chrome.border,
          color: theme.chrome.text,
        }}
      >
        <div className="mb-4">
          <p className={labelClass} style={{ color: theme.chrome.subtle }}>
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
        </div>

        <div className="mb-4">
          <p className={labelClass} style={{ color: theme.chrome.subtle }}>
            Theme
          </p>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                aria-label={`${t.label} theme`}
                className="h-9 flex-1 rounded-lg border-2 text-xs font-medium transition"
                style={{
                  background: t.swatch,
                  color: t.chrome.text,
                  borderColor: themeId === t.id ? '#d97706' : t.chrome.border,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass} style={{ color: theme.chrome.subtle }}>
            Layout
          </p>
          <div
            className="flex overflow-hidden rounded-lg border"
            style={{ borderColor: theme.chrome.border }}
          >
            {FLOWS.map((f) => (
              <button
                key={f}
                onClick={() => setFlow(f)}
                className="flex-1 px-3 py-1.5 text-sm capitalize transition"
                style={{
                  background: flow === f ? '#d97706' : 'transparent',
                  color: flow === f ? '#fff' : theme.chrome.text,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
