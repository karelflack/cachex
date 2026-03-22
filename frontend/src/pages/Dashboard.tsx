import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import Badge from '../components/ui/Badge'
import { fetchStats, fetchUsage } from '../api/client'
import type { Stats, UsageLog } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [usage, setUsage] = useState<UsageLog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchStats(), fetchUsage()])
      .then(([s, u]) => {
        setStats(s)
        setUsage(u)
      })
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-danger text-sm">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted mt-1">Cache performance and usage</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Requests" value={stats?.total_requests ?? '—'} />
        <StatCard
          label="Cache Hit Rate"
          value={stats ? `${stats.cache_hit_rate}%` : '—'}
          sub={`${stats?.cached_requests ?? 0} cached / ${stats?.live_requests ?? 0} live`}
        />
        <StatCard
          label="Tokens Used"
          value={
            stats
              ? (stats.prompt_tokens_used + stats.completion_tokens_used).toLocaleString()
              : '—'
          }
          sub="live requests only"
        />
        <StatCard
          label="Est. Savings"
          value={stats ? `$${stats.estimated_saved_usd}` : '—'}
          sub="based on cached requests"
        />
      </div>

      <div className="bg-surface border border-stroke rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stroke">
          <h2 className="text-sm font-medium text-ink">Recent Requests</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stroke">
              <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Time</th>
              <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Model</th>
              <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Provider</th>
              <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Status</th>
              <th className="text-right px-5 py-3 text-xs text-ink-muted font-medium">Tokens</th>
            </tr>
          </thead>
          <tbody>
            {usage.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink-faint text-sm">
                  No requests yet
                </td>
              </tr>
            )}
            {usage.map((row) => (
              <tr
                key={row.id}
                className="border-b border-stroke/50 last:border-0 hover:bg-elevated/40"
              >
                <td className="px-5 py-3.5 text-ink-muted font-mono text-xs">
                  {new Date(row.created_at).toLocaleTimeString()}
                </td>
                <td className="px-5 py-3.5 text-ink">{row.model}</td>
                <td className="px-5 py-3.5 text-ink-muted">{row.provider}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={row.cached ? 'teal' : 'muted'}>
                    {row.cached ? 'cached' : 'live'}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-right text-ink-muted font-mono text-xs">
                  {row.prompt_tokens != null
                    ? (row.prompt_tokens + (row.completion_tokens ?? 0)).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
