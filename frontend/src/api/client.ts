import axios from 'axios'
import { supabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// --- Types ---

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

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  status: 'active' | 'revoked'
}

export interface CreatedApiKey {
  id: string
  name: string
  key: string
  created_at: string
}

// --- Endpoints ---

export const fetchStats = () =>
  api.get<Stats>('/dashboard/stats').then((r) => r.data)

export const fetchUsage = () =>
  api.get<UsageLog[]>('/dashboard/usage').then((r) => r.data)

export const fetchApiKeys = () =>
  api.get<ApiKey[]>('/api/keys').then((r) => r.data)

export const createApiKey = (name: string) =>
  api.post<CreatedApiKey>('/api/keys', { name }).then((r) => r.data)

export const revokeApiKey = (id: string) =>
  api.delete(`/api/keys/${id}`)
