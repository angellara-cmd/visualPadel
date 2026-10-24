'use client'

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Timer, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Cell, cellKey, generatePuzzle } from '@/lib/word-search'
import { Board } from './board'
import { WordList } from './word-list'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function Game({ initialSeed }: { initialSeed: number }) {
  const [seed, setSeed] = useState(initialSeed)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [seconds, setSeconds] = useState(0)

  const puzzle = useMemo(() => generatePuzzle(seed), [seed])
  const isComplete = found.size === puzzle.words.length

  useEffect(() => {
    if (isComplete) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [isComplete, seed])

  const foundCells = useMemo(() => {
    const keys = new Set<string>()
    puzzle.words
      .filter((w) => found.has(w.word))
      .forEach((w) => w.cells.forEach((c) => keys.add(cellKey(c))))
    return keys
  }, [puzzle, found])

  function handleSelect(cells: Cell[]) {
    const selected = cells.map(cellKey).join('|')
    const reversed = [...cells].reverse().map(cellKey).join('|')
    const match = puzzle.words.find((w) => {
      if (found.has(w.word)) return false
      const path = w.cells.map(cellKey).join('|')
      return path === selected || path === reversed
    })
    if (!match) return false
    setFound((prev) => new Set(prev).add(match.word))
    return true
  }

  function restart() {
    setSeed((prev) => (prev + Math.floor(Math.random() * 1_000_000) + 1) >>> 0)
    setFound(new Set())
    setSeconds(0)
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex w-full flex-col gap-4 lg:max-w-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-court-deep">
              <Timer className="size-4 text-court" aria-hidden="true" />
              <span className="font-display text-xl font-bold tabular-nums" aria-label="Tiempo">
                {formatTime(seconds)}
              </span>
            </div>
            <div className="h-5 w-px bg-border" aria-hidden="true" />
            <div className="font-display text-xl font-bold text-court-deep tabular-nums">
              {found.size}
              <span className="text-muted-foreground">/{puzzle.words.length}</span>
            </div>
          </div>
          <Button onClick={restart} className="gap-2 font-display text-sm font-bold uppercase tracking-wide">
            <RotateCcw className="size-4" aria-hidden="true" />
            Reiniciar
          </Button>
        </div>

        <div className="relative">
          <Board key={seed} grid={puzzle.grid} foundCells={foundCells} onSelect={handleSelect} />
          {isComplete && (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-court-deep/90 p-6 text-center text-white backdrop-blur-sm"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-ball text-court-deep">
                <Trophy className="size-7" aria-hidden="true" />
              </div>
              <p className="font-display text-3xl font-extrabold uppercase italic tracking-tight">
                ¡Punto de oro!
              </p>
              <p className="text-sm text-white/80">
                Has encontrado todas las palabras en {formatTime(seconds)}
              </p>
              <Button
                onClick={restart}
                className="mt-1 gap-2 bg-ball font-display font-bold uppercase tracking-wide text-court-deep hover:bg-ball/90"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Nueva partida
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Arrastra en línea recta sobre las letras. Las palabras pueden ir en horizontal, vertical,
          diagonal y al revés.
        </p>
      </div>

      <div className="w-full lg:max-w-sm">
        <WordList words={puzzle.words.map((w) => w.word)} found={found} />
      </div>
    </div>
  )
}
