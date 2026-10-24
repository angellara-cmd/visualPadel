export function SiteHeader() {
  return (
    <header className="relative overflow-hidden bg-court-deep text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, transparent calc(50% - 1px), white calc(50% - 1px), white calc(50% + 1px), transparent calc(50% + 1px)), linear-gradient(to bottom, transparent calc(70% - 1px), white calc(70% - 1px), white calc(70% + 1px), transparent calc(70% + 1px))',
        }}
      />
      <div className="relative mx-auto flex max-w-5xl items-center gap-3 px-3 py-5 sm:px-6 sm:py-8">
        <div
          aria-hidden="true"
          className="relative size-10 shrink-0 rounded-full bg-ball shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.12)] sm:size-12"
        >
          <span className="absolute inset-1 rounded-full border-2 border-white/80 [clip-path:inset(0_50%_0_0)]" />
        </div>
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ball">
            Pádel Challenge
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase italic leading-none tracking-tight sm:text-5xl">
            Sopa de letras
          </h1>
        </div>
      </div>
      <div className="h-1 bg-ball" aria-hidden="true" />
    </header>
  )
}
