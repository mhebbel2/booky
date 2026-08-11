import ePub from 'epubjs'
import { db, type Book } from './db'

export async function importEpub(file: File): Promise<Book> {
  const data = await file.arrayBuffer()

  const book = ePub(data)
  await book.ready

  const metadata = await book.loaded.metadata
  const title = metadata.title?.trim() || file.name.replace(/\.epub$/i, '')
  const author = metadata.creator?.trim() || 'Unknown author'

  let cover: Blob | undefined
  try {
    const coverUrl = await book.coverUrl()
    if (coverUrl) {
      const res = await fetch(coverUrl)
      cover = await res.blob()
    }
  } catch {
    // Book has no usable cover — the library shows a placeholder instead.
  }

  book.destroy()

  const record: Book = {
    id: crypto.randomUUID(),
    title,
    author,
    cover,
    data,
    addedAt: Date.now(),
  }
  await db.books.add(record)
  return record
}
