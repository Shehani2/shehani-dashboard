'use client'

import { useMemo, useState } from 'react'
import { GripVertical, LayoutGrid, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ColumnId = 'todo' | 'progress' | 'done'

type Card = {
  id: string
  title: string
  project: string
  column: ColumnId
}

const columns: { id: ColumnId; label: string; dot: string }[] = [
  { id: 'todo', label: 'To-Do', dot: 'bg-muted-foreground' },
  { id: 'progress', label: 'In Progress', dot: 'bg-primary' },
  { id: 'done', label: 'Done', dot: 'bg-accent' },
]

const projectColors: Record<string, string> = {
  'Website': 'text-primary',
  'Mobile App': 'text-accent',
  'Marketing': 'text-chart-4',
  'Ops': 'text-muted-foreground',
}

const initialCards: Card[] = [
  { id: 'c1', title: 'Redesign pricing page', project: 'Website', column: 'todo' },
  { id: 'c2', title: 'User interviews round 2', project: 'Mobile App', column: 'todo' },
  { id: 'c3', title: 'Q3 content calendar', project: 'Marketing', column: 'todo' },
  { id: 'c4', title: 'Build onboarding flow', project: 'Mobile App', column: 'progress' },
  { id: 'c5', title: 'SEO audit fixes', project: 'Website', column: 'progress' },
  { id: 'c6', title: 'Launch newsletter', project: 'Marketing', column: 'done' },
  { id: 'c7', title: 'Vendor contracts signed', project: 'Ops', column: 'done' },
]

export function ProjectsKanban() {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<ColumnId | null>(null)
  const [adding, setAdding] = useState<ColumnId | null>(null)
  const [draft, setDraft] = useState('')

  const grouped = useMemo(
    () =>
      columns.reduce(
        (acc, col) => {
          acc[col.id] = cards.filter((c) => c.column === col.id)
          return acc
        },
        {} as Record<ColumnId, Card[]>,
      ),
    [cards],
  )

  function moveCard(id: string, column: ColumnId) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, column } : c)))
  }

  function addCard(column: ColumnId) {
    const title = draft.trim()
    if (!title) {
      setAdding(null)
      return
    }
    setCards((prev) => [
      ...prev,
      { id: `c${Date.now()}`, title, project: 'Website', column },
    ])
    setDraft('')
    setAdding(null)
  }

  return (
    <section aria-labelledby="projects-heading" className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="projects-heading" className="font-display text-lg font-semibold leading-tight">
            Monthly projects
          </h2>
          <p className="text-xs text-muted-foreground">Drag cards across your board</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              setOverCol(col.id)
            }}
            onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
            onDrop={() => {
              if (dragId) moveCard(dragId, col.id)
              setDragId(null)
              setOverCol(null)
            }}
            className={cn(
              'flex flex-col gap-3 rounded-xl border border-border/70 bg-background/40 p-3 transition-colors',
              overCol === col.id && 'border-primary/60 bg-primary/5',
            )}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', col.dot)} />
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-muted-foreground">{grouped[col.id].length}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdding(col.id)
                  setDraft('')
                }}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={`Add card to ${col.label}`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex min-h-[60px] flex-col gap-2.5">
              {grouped[col.id].map((card) => (
                <article
                  key={card.id}
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  onDragEnd={() => {
                    setDragId(null)
                    setOverCol(null)
                  }}
                  className={cn(
                    'group cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-all active:cursor-grabbing',
                    dragId === card.id ? 'opacity-40' : 'hover:border-primary/40',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p
                        className={cn(
                          'text-sm font-medium leading-snug',
                          card.column === 'done' && 'text-muted-foreground line-through',
                        )}
                      >
                        {card.title}
                      </p>
                      <span
                        className={cn(
                          'mt-1.5 inline-block text-[11px] font-medium',
                          projectColors[card.project] ?? 'text-muted-foreground',
                        )}
                      >
                        {card.project}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              {adding === col.id && (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => addCard(col.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229)
                      addCard(col.id)
                    if (e.key === 'Escape') setAdding(null)
                  }}
                  placeholder="Card title..."
                  className="h-9 w-full rounded-lg border border-primary/50 bg-card px-3 text-sm outline-none placeholder:text-muted-foreground/70"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
