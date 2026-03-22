interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-surface border border-stroke rounded-xl p-5">
      <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">{label}</p>
      <p className="text-ink text-2xl font-semibold font-mono mt-2">{value}</p>
      {sub && <p className="text-ink-faint text-xs mt-1">{sub}</p>}
    </div>
  )
}
