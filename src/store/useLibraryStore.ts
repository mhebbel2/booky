import { create } from 'zustand'
import { db, type Book } from '../lib/db'
import { importEpub } from '../lib/importEpub'

interface LibraryState {
  books: Book[]
  /** bookId -> 0..1 reading progress, for the library cards */
  progress: Record<string, number>
  loading: boolean
  importing: boolean
  error: string | null
  loadBooks: () => Promise<void>
  importFiles: (files: FileList | File[]) => Promise<void>
  removeBook: (id: string) => Promise<void>
}

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  progress: {},
  loading: true,
  importing: false,
  error: null,

  loadBooks: async () => {
    const [books, progressRows] = await Promise.all([
      db.books.orderBy('addedAt').reverse().toArray(),
      db.progress.toArray(),
    ])
    const progress: Record<string, number> = {}
    for (const row of progressRows) progress[row.bookId] = row.percentage
    set({ books, progress, loading: false })
  },

  importFiles: async (files) => {
    set({ importing: true, error: null })
    try {
      for (const file of Array.from(files)) {
        if (!/\.epub$/i.test(file.name)) continue
        const book = await importEpub(file)
        set((s) => ({ books: [book, ...s.books] }))
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Could not import that file.' })
    } finally {
      set({ importing: false })
    }
  },

  removeBook: async (id) => {
    await db.books.delete(id)
    await db.progress.delete(id)
    set((s) => {
      const progress = { ...s.progress }
      delete progress[id]
      return { books: s.books.filter((b) => b.id !== id), progress }
    })
  },
}))
