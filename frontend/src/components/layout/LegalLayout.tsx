import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  contact?: string
  children: ReactNode
}

export default function LegalLayout({
  title,
  lastUpdated,
  contact = 'privacy@cachex.dev',
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Logo */}
        <div className="mb-10">
          <Link to="/" className="text-xl font-bold text-ink tracking-tight hover:opacity-80 transition-opacity">
            Cache<span className="text-teal">x</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 pb-8 border-b border-stroke">
          <h1 className="text-2xl font-semibold text-ink mb-3">{title}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
            <span>Last updated: {lastUpdated}</span>
            <a href={`mailto:${contact}`} className="text-teal hover:underline">
              {contact}
            </a>
          </div>
        </div>

        {/* Markdown content */}
        <div className="prose-legal">{children}</div>

      </div>
    </div>
  )
}
