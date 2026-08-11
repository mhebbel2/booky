import { Route, Routes } from 'react-router-dom'
import LibraryView from './components/library/LibraryView'
import ReaderView from './components/reader/ReaderView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryView />} />
      <Route path="/read/:bookId" element={<ReaderView />} />
      <Route path="*" element={<LibraryView />} />
    </Routes>
  )
}
