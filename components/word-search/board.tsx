'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { type Cell, cellKey, lineBetween } from '@/lib/word-search'

type BoardProps = {
  grid: string[][]
  foundCells: Set<string>
  onSelect: (cells: Cell[]) => boolean
}

function cellFromPoint(x: number, y: number): Cell | null {
  const element = document.elementFromPoint(x, y)
  const target = element instanceof HTMLElement ? element.closest<HTMLElement>('[data-row]') : null
  if (!target) return null
  return { row: Number(target.dataset.row), col: Number(target.dataset.col) }
}

export function Board({ grid, foundCells, onSelect }: BoardProps) {
  const [start, setStart] = useState<Cell | null>(null)
  const [selection, setSelection] = useState<Cell[]>([])
  const [missKey, setMissKey] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const selectedKeys = new Set(selection.map(cellKey))
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const cell = cellFromPoint(event.clientX, event.clientY)
    if (!cell) return
    boardRef.current?.setPointerCapture(event.pointerId)
    setStart(cell)
    setSelection([cell])
    setMissKey(null)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!start) return
    const cell = cellFromPoint(event.clientX, event.clientY)
    if (!cell) return
    const line = lineBetween(start, cell).filter(
      (c) => c.row >= 0 && c.row < rows && c.col >= 0 && c.col < cols,
    )
    setSelection(line)
  }

  function finishSelection() {
    if (!start) return
    const matched = selection.length > 1 && onSelect(selection)
    if (!matched && selection.length > 1) {
      setMissKey(selection.map(cellKey).join('|'))
    }
    setStart(null)
    setSelection([])
  }

  return (
    <div
      ref={boardRef}
      role="grid"
      aria-label="Sopa de letras de pádel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSelection}
      onPointerCancel={finishSelection}
      className={cn(
        'grid touch-none select-none gap-0.5 rounded-xl bg-court-deep p-1.5 sm:gap-1 sm:p-3',
        missKey && 'animate-[shake_0.3s_ease-in-out]',
      )}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      onAnimationEnd={() => setMissKey(null)}
    >
      {grid.map((row, r) =>
        row.map((letter, c) => {
          const key = `${r}-${c}`
          const isSelected = selectedKeys.has(key)
          const isFound = foundCells.has(key)
          return (
            <div
              key={key}
              role="gridcell"
              data-row={r}
              data-col={c}
              aria-selected={isSelected || isFound}
              className={cn(
                'flex aspect-square cursor-pointer items-center justify-center rounded-[4px] font-display text-sm font-bold uppercase transition-colors duration-150 sm:rounded-md sm:text-xl',
                isSelected
                  ? 'scale-105 bg-primary text-primary-foreground'
                  : isFound
                    ? 'bg-ball text-ball-foreground'
                    : 'bg-white/95 text-court-deep hover:bg-white',
              )}
            >
              {letter}
            </div>
          )
        }),
      )}
    </div>
  )
}
