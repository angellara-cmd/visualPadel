export const GRID_ROWS = 9
export const GRID_COLS = 12
export const WORDS_PER_GAME = 10

export const PADEL_WORDS = [
  'PALA',
  'PELOTA',
  'RED',
  'BANDEJA',
  'VIBORA',
  'GLOBO',
  'SMASH',
  'VOLEA',
  'CRISTAL',
  'PISTA',
  'REVES',
  'DRIVE',
  'SAQUE',
  'RESTO',
  'REMATE',
  'CHIQUITA',
  'PARED',
  'MALLA',
  'PUNTO',
  'PARTIDO',
  'DEJADA',
  'BAJADA',
  'TORNEO',
  'DERECHA',
  'RULO',
  'JUEGO',
  'GRIP',
  'PAREJA',
  'SET',
  'EMPATE',
]

export type Cell = { row: number; col: number }

export type PlacedWord = {
  word: string
  cells: Cell[]
}

export type Puzzle = {
  grid: string[][]
  words: PlacedWord[]
}

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
]

const ALPHABET = 'ABCDEFGHIJLMNOPQRSTUVXYZ'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function tryPlace(
  grid: (string | null)[][],
  word: string,
  random: () => number,
): Cell[] | null {
  for (let attempt = 0; attempt < 250; attempt++) {
    const [dr, dc] = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)]
    const row = Math.floor(random() * GRID_ROWS)
    const col = Math.floor(random() * GRID_COLS)
    const endRow = row + dr * (word.length - 1)
    const endCol = col + dc * (word.length - 1)
    if (endRow < 0 || endRow >= GRID_ROWS || endCol < 0 || endCol >= GRID_COLS) continue

    const cells: Cell[] = []
    let fits = true
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i
      const c = col + dc * i
      const existing = grid[r][c]
      if (existing !== null && existing !== word[i]) {
        fits = false
        break
      }
      cells.push({ row: r, col: c })
    }
    if (!fits) continue

    cells.forEach((cell, i) => {
      grid[cell.row][cell.col] = word[i]
    })
    return cells
  }
  return null
}

export function generatePuzzle(seed: number): Puzzle {
  const random = mulberry32(seed)
  const grid: (string | null)[][] = Array.from({ length: GRID_ROWS }, () =>
    Array<string | null>(GRID_COLS).fill(null),
  )

  const candidates = shuffle(PADEL_WORDS, random)
  const chosen = candidates
    .slice(0, WORDS_PER_GAME + 4)
    .sort((a, b) => b.length - a.length)

  const words: PlacedWord[] = []
  for (const word of chosen) {
    if (words.length >= WORDS_PER_GAME) break
    const cells = tryPlace(grid, word, random)
    if (cells) words.push({ word, cells })
  }

  const filled = grid.map((row) =>
    row.map((letter) => letter ?? ALPHABET[Math.floor(random() * ALPHABET.length)]),
  )

  return {
    grid: filled,
    words: words.sort((a, b) => a.word.localeCompare(b.word)),
  }
}

export function lineBetween(start: Cell, end: Cell): Cell[] {
  const dr = end.row - start.row
  const dc = end.col - start.col
  const absR = Math.abs(dr)
  const absC = Math.abs(dc)

  let stepR = Math.sign(dr)
  let stepC = Math.sign(dc)
  if (absR > absC * 2) stepC = 0
  else if (absC > absR * 2) stepR = 0

  const length = stepR !== 0 && stepC !== 0 ? Math.min(absR, absC) : Math.max(absR, absC)

  const cells: Cell[] = []
  for (let i = 0; i <= length; i++) {
    cells.push({ row: start.row + stepR * i, col: start.col + stepC * i })
  }
  return cells
}

export const cellKey = (cell: Cell) => `${cell.row}-${cell.col}`
