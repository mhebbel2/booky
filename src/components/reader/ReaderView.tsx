import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ePub, { type Rendition } from 'epubjs'
import { db, type Book } from '../../lib/db'
import { THEMES, getTheme } from '../../lib/themes'
import { useSystemTheme } from '../../hooks/useSystemTheme'
import ReaderToolbar from './ReaderToolbar'
import TocSidebar, { type TocEntry } from './TocSidebar'
import ProgressBar from './ProgressBar'

interface RawTocItem {
  id?: string
  href: string
  label?: string
  subitems?: RawTocItem[]
}

function flattenToc(items: RawTocItem[], depth = 0): TocEntry[] {
  const out: TocEntry[] = []
  for (const item of items) {
    out.push({
      id: item.id ?? item.href,
      href: item.href,
      label: (item.label ?? '').trim(),
      depth,
    })
    if (item.subitems?.length) out.push(...flattenToc(item.subitems, depth + 1))
  }
  return out
}

export default function ReaderView() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const themeId = useSystemTheme()
  const theme = getTheme(themeId)

  const [record, setRecord] = useState<Book | null>(null)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [percentage, setPercentage] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)

  const viewerRef = useRef<HTMLDivElement>(null)
  const renditionRef = useRef<Rendition | null>(null)
  const cfiRef = useRef<string | null>(null)
  const saveTimer = useRef<number | undefined>(undefined)
  // Lets the rendition-creation effect read the current theme without
  // depending on it (theme changes are applied live, without recreation).
  const themeIdRef = useRef(themeId)
  themeIdRef.current = themeId

  // Load the book record from IndexedDB.
  useEffect(() => {
    if (!bookId) return
    let alive = true
    void db.books.get(bookId).then((r) => {
      if (!alive) return
      if (!r) navigate('/', { replace: true })
      else setRecord(r)
    })
    return () => {
      alive = false
    }
  }, [bookId, navigate])

  const next = useCallback(() => {
    void renditionRef.current?.next()
  }, [])
  const prev = useCallback(() => {
    void renditionRef.current?.prev()
  }, [])

  // Keyboard navigation (window level; iframe keys are hooked separately).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Create the epub.js book + rendition.
  useEffect(() => {
    if (!record || !viewerRef.current) return
    let cancelled = false

    const book = ePub(record.data)
    const rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none',
    })
    renditionRef.current = rendition

    for (const t of THEMES) {
      rendition.themes.register(t.id, t.rules)
    }
    rendition.themes.select(themeIdRef.current)

    // epub.js puts the book in an iframe; forward its key events so arrow
    // keys keep working after the user clicks into the text.
    const onIframeKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
    }
    const hookIframeKeys = () => {
      const contents = rendition.getContents() as unknown
      const list = Array.isArray(contents) ? contents : [contents]
      for (const c of list) {
        const doc = (c as { document?: Document } | null)?.document
        doc?.addEventListener('keydown', onIframeKey)
      }
    }
    rendition.on('rendered', hookIframeKeys)

    const savePosition = async (cfi: string) => {
      let pct: number
      try {
        if (book.locations.length()) {
          pct = book.locations.percentageFromCfi(cfi)
        } else {
          // Locations not ready yet — don't clobber the stored percentage.
          pct = (await db.progress.get(record.id))?.percentage ?? 0
        }
      } catch {
        pct = 0
      }
      setPercentage(pct)
      await db.progress.put({ bookId: record.id, cfi, percentage: pct, updatedAt: Date.now() })
    }

    const onRelocated = (location: { start: { cfi: string } }) => {
      const cfi = location.start.cfi
      cfiRef.current = cfi
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => void savePosition(cfi), 250)
    }
    rendition.on('relocated', onRelocated)

    void (async () => {
      try {
        const saved = await db.progress.get(record.id)
        if (saved) setPercentage(saved.percentage)
        await rendition.display(cfiRef.current ?? saved?.cfi ?? undefined)
        if (cancelled) return

        const nav = await book.loaded.navigation
        if (cancelled) return
        setToc(flattenToc(nav.toc as unknown as RawTocItem[]))

        // Generate locations in the background to power the progress bar,
        // then re-save the position with an accurate percentage.
        await book.locations.generate(1000)
        if (!cancelled && cfiRef.current) {
          await savePosition(cfiRef.current)
        }
      } catch (err) {
        console.error('Failed to render book', err)
      }
    })()

    return () => {
      cancelled = true
      window.clearTimeout(saveTimer.current)
      try {
        rendition.destroy()
      } catch {
        // already gone
      }
      try {
        book.destroy()
      } catch {
        // already gone
      }
      renditionRef.current = null
    }
  }, [record, next, prev])

  // Live-apply the theme without recreating the rendition.
  useEffect(() => {
    renditionRef.current?.themes.select(themeId)
  }, [themeId])

  const goTo = useCallback((href: string) => {
    void renditionRef.current?.display(href)
    setTocOpen(false)
  }, [])

  if (!record) {
    return <div className="h-full" style={{ background: theme.chrome.bg }} />
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: theme.chrome.bg, color: theme.chrome.text }}
    >
      <ReaderToolbar
        title={record.title}
        author={record.author}
        percentage={percentage}
        theme={theme}
        onBack={() => navigate('/')}
        onToggleToc={() => setTocOpen((v) => !v)}
      />

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 px-2 py-2 sm:px-6 sm:py-4">
          <div ref={viewerRef} className="h-full w-full" />
        </div>

        <button
          aria-label="Previous page"
          onClick={prev}
          className="absolute inset-y-0 left-0 z-10 w-[15%]"
        />
        <button
          aria-label="Next page"
          onClick={next}
          className="absolute inset-y-0 right-0 z-10 w-[15%]"
        />

        <TocSidebar
          toc={toc}
          open={tocOpen}
          theme={theme}
          onClose={() => setTocOpen(false)}
          onSelect={goTo}
        />
      </div>

      <ProgressBar percentage={percentage} theme={theme} />
    </div>
  )
}
