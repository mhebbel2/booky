import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSystemTheme } from './hooks/useSystemTheme'
import LibraryView from './components/library/LibraryView'
import ReaderView from './components/reader/ReaderView'

export default function App() {
  const themeId = useSystemTheme()

  // The reader applies the system theme to the book iframe; here we mirror
  // it to the library via Tailwind's class-based dark mode.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeId === 'dark')
  }, [themeId])

  return (
    <Routes>
      <Route path="/" element={<LibraryView />} />
      <Route path="/read/:bookId" element={<ReaderView />} />
      <Route path="*" element={<LibraryView />} />
    </Routes>
  )
}
