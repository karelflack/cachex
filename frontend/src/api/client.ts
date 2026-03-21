import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY || ''
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
})

export interface Stats {
  total_requests: number
  cached_requests: number
  live_requests: number
  cache_hit_rate: number
  prompt_tokens_used: number
  completion_tokens_used: number
  estimated_saved_usd: number
}

export interface UsageLog {
  id: string
  provider: string
  model: string
  cached: boolean
  prompt_tokens: number | null
  completion_tokens: number | null
  created_at: string
}

export const fetchStats = () => api.get<Stats>('/dashboard/stats').then(r => r.data)
export const fetchUsage = () => api.get<UsageLog[]>('/dashboard/usage').then(r => r.data)
