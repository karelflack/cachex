interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddings = { sm: 'p-4', md: 'p-5', lg: 'p-6' }

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={`bg-surface border border-stroke rounded-xl ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}
