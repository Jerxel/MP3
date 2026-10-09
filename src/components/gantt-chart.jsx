const BLOCK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function GanttChart({ schedule }) {
  if (!schedule.length) return null

  const totalTime = schedule[schedule.length - 1].finish || 1
  const idColor = new Map()
  let colorIndex = 0
  for (const block of schedule) {
    if (!idColor.has(block.id)) {
      idColor.set(block.id, BLOCK_COLORS[colorIndex % BLOCK_COLORS.length])
      colorIndex += 1
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex h-12 w-full overflow-hidden rounded-md border border-border">
        {schedule.map((block, i) => {
          const widthPct = ((block.finish - block.start) / totalTime) * 100
          return (
            <div
              key={`${block.id}-${i}`}
              className="flex items-center justify-center border-r border-background/40 text-xs font-medium text-white last:border-r-0"
              style={{
                width: `${widthPct}%`,
                backgroundColor: idColor.get(block.id),
                minWidth: widthPct > 0 ? "2.5rem" : 0,
              }}
              title={`${block.id}: ${block.start} – ${block.finish}`}
            >
              {block.id}
            </div>
          )
        })}
      </div>
      <div className="relative h-4 text-[11px] text-muted-foreground">
        {[...new Set(schedule.flatMap((b) => [b.start, b.finish]))]
          .sort((a, b) => a - b)
          .map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2"
              style={{ left: `${(t / totalTime) * 100}%` }}
            >
              {t}
            </span>
          ))}
      </div>
    </div>
  )
}
