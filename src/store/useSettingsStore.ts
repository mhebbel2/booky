import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /** Font size as a percentage, e.g. 100 */
  fontSize: number
  setFontSize: (fontSize: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 100,
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    { name: 'booky-settings' },
  ),
)
