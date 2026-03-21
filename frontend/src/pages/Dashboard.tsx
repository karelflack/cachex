import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { fetchStats, fetchUsage, Stats, UsageLog } from '../api/client'

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
      .catch(e => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Cache performance and usage</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Requests"
            value={stats?.total_requests ?? '—'}
          />
          <StatCard
            label="Cache Hit Rate"
            value={stats ? `${stats.cache_hit_rate}%` : '—'}
            sub={`${stats?.cached_requests ?? 0} cached / ${stats?.live_requests ?? 0} live`}
          />
          <StatCard
            label="Tokens Used"
            value={stats ? (stats.prompt_tokens_used + stats.completion_tokens_used).toLocaleString() : '—'}
            sub="live requests only"
          />
          <StatCard
            label="Est. Savings"
            value={stats ? `$${stats.estimated_saved_usd}` : '—'}
            sub="based on cached requests"
          />
        </div>

        {/* Usage table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium">Recent Requests</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                <th className="text-left px-5 py-3">Time</th>
                <th className="text-left px-5 py-3">Model</th>
                <th className="text-left px-5 py-3">Provider</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {usage.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-zinc-600">
                    No requests yet
                  </td>
                </tr>
              )}
              {usage.map(row => (
                <tr key={row.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-5 py-3 text-zinc-400">
                    {new Date(row.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-3 text-zinc-300">{row.model}</td>
                  <td className="px-5 py-3 text-zinc-400">{row.provider}</td>
                  <td className="px-5 py-3">
                    {row.cached ? (
                      <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded">cached</span>
                    ) : (
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">live</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-400">
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
    </div>
  )
}
