import { useNavigate } from 'react-router-dom'
import { BookOpen, Trash2 } from 'lucide-react'
import type { Book } from '../../lib/db'
import { useObjectUrl } from '../../hooks/useObjectUrl'

interface Props {
  book: Book
  percentage: number
  onDelete: () => void
}

export default function BookCard({ book, percentage, onDelete }: Props) {
  const navigate = useNavigate()
  const coverUrl = useObjectUrl(book.cover)

  return (
    <div className="group relative">
      <button onClick={() => navigate(`/read/${book.id}`)} className="block w-full text-left">
        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-stone-200 shadow-sm transition group-hover:shadow-md dark:bg-stone-800">
          {coverUrl ? (
            <img src={coverUrl} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
              <BookOpen size={32} className="text-stone-400 dark:text-stone-500" />
              <span className="line-clamp-3 text-sm font-medium text-stone-600 dark:text-stone-300">
                {book.title}
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 truncate text-sm font-medium">{book.title}</p>
        <p className="truncate text-xs text-stone-500 dark:text-stone-400">{book.author}</p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
          <div
            className="h-full rounded-full bg-amber-600"
            style={{ width: `${Math.round(percentage * 100)}%` }}
          />
        </div>
      </button>
      <button
        onClick={onDelete}
        aria-label={`Remove ${book.title}`}
        className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
