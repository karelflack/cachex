type BadgeVariant = 'teal' | 'muted' | 'danger' | 'warning'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variants: Record<BadgeVariant, string> = {
  teal: 'bg-teal-subtle text-teal border-teal/20',
  muted: 'bg-elevated text-ink-muted border-stroke',
  danger: 'bg-danger-subtle text-danger border-danger/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function Badge({ variant = 'muted', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
