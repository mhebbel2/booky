import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ReadingFlow = 'paginated' | 'scrolled'

interface SettingsState {
  /** Font size as a percentage, e.g. 100 */
  fontSize: number
  themeId: string
  flow: ReadingFlow
  setFontSize: (fontSize: number) => void
  setThemeId: (themeId: string) => void
  setFlow: (flow: ReadingFlow) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 100,
      themeId: 'light',
      flow: 'paginated',
      setFontSize: (fontSize) => set({ fontSize }),
      setThemeId: (themeId) => set({ themeId }),
      setFlow: (flow) => set({ flow }),
    }),
    { name: 'booky-settings' },
  ),
)
