import { useState } from 'react'
import type { ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  return (
    <div>
      <div className="flex border-b border-stroke">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
              ${
                active === tab.id
                  ? 'text-teal border-teal'
                  : 'text-ink-muted border-transparent hover:text-ink'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  )
}
