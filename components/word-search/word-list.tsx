import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type WordListProps = {
  words: string[]
  found: Set<string>
}

export function WordList({ words, found }: WordListProps) {
  return (
    <section aria-labelledby="word-list-title" className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2
          id="word-list-title"
          className="font-display text-lg font-bold uppercase tracking-wide text-court-deep"
        >
          Palabras
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          {found.size} de {words.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {words.map((word) => {
          const isFound = found.has(word)
          return (
            <li
              key={word}
              className={cn(
                'flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-display text-sm font-semibold uppercase tracking-wider transition-colors',
                isFound
                  ? 'border-transparent bg-ball/40 text-court-deep/60 line-through'
                  : 'bg-secondary text-court-deep',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border',
                  isFound ? 'border-court-deep bg-court-deep text-ball' : 'border-court/40',
                )}
              >
                {isFound && <Check className="size-3" strokeWidth={3} />}
              </span>
              {word}
              {isFound && <span className="sr-only">(encontrada)</span>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
