import Dexie, { type EntityTable } from 'dexie'

export interface Book {
  id: string
  title: string
  author: string
  cover?: Blob
  data: ArrayBuffer
  addedAt: number
}

export interface Progress {
  bookId: string
  cfi: string
  percentage: number
  updatedAt: number
}

export const db = new Dexie('booky') as Dexie & {
  books: EntityTable<Book, 'id'>
  progress: EntityTable<Progress, 'bookId'>
}

db.version(1).stores({
  books: 'id, title, author, addedAt',
  progress: 'bookId, updatedAt',
})
