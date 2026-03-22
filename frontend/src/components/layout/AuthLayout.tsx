import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <span className="text-2xl font-bold text-ink tracking-tight">
          Cache<span className="text-teal">x</span>
        </span>
      </div>
      <div className="w-full max-w-sm bg-surface border border-stroke rounded-xl p-6">
        {children}
      </div>
    </div>
  )
}
