import { useEffect, useState, type DragEvent } from 'react'
import { BookOpen } from 'lucide-react'
import { useLibraryStore } from '../../store/useLibraryStore'
import BookCard from './BookCard'
import ImportButton from './ImportButton'

export default function LibraryView() {
  const {
    books,
    progress,
    loading,
    importing,
    error,
    loadBooks,
    importFiles,
    removeBook,
  } = useLibraryStore()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    void loadBooks()
  }, [loadBooks])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) void importFiles(e.dataTransfer.files)
  }

  return (
    <div
      className="h-full overflow-y-auto bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false)
      }}
      onDrop={onDrop}
    >
      <header className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-6">
        <BookOpen className="text-amber-700 dark:text-amber-500" size={28} />
        <h1 className="flex-1 text-2xl font-semibold tracking-tight">Booky</h1>
        <ImportButton importing={importing} onFiles={importFiles} />
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-24 text-center text-stone-500 dark:text-stone-400">
            Loading your library…
          </p>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <BookOpen size={48} className="text-stone-400 dark:text-stone-500" />
            <div>
              <p className="text-lg font-medium">Your library is empty</p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Drop an EPUB anywhere on this page, or use the import button.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                percentage={progress[book.id] ?? 0}
                onDelete={() => {
                  if (window.confirm(`Remove "${book.title}" from your library?`)) {
                    void removeBook(book.id)
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-amber-600/20 backdrop-blur-sm">
          <div className="rounded-xl border-2 border-dashed border-amber-700 bg-white/90 px-8 py-6 text-lg font-medium text-amber-900 dark:bg-stone-900/90 dark:text-amber-200">
            Drop EPUB to import
          </div>
        </div>
      )}
    </div>
  )
}
