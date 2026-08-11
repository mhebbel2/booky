import { useEffect, useState } from 'react'

export type SystemTheme = 'light' | 'dark'

function currentSystemTheme(): SystemTheme {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** Follows the OS light/dark preference, updating live when it changes. */
export function useSystemTheme(): SystemTheme {
  const [theme, setTheme] = useState<SystemTheme>(currentSystemTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return theme
}
