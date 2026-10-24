import { connection } from 'next/server'
import { Game } from '@/components/word-search/game'
import { SiteHeader } from '@/components/site-header'

export default async function Page() {
  await connection()
  const initialSeed = Math.floor(Math.random() * 2 ** 31)

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
        <Game initialSeed={initialSeed} />
      </main>
    </div>
  )
}
