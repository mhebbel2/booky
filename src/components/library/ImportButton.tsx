import { useRef } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  importing: boolean
  onFiles: (files: FileList) => void
}

export default function ImportButton({ importing, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".epub,application/epub+zip"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={importing}
        className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
      >
        <Plus size={16} />
        {importing ? 'Importing…' : 'Import EPUB'}
      </button>
    </>
  )
}
