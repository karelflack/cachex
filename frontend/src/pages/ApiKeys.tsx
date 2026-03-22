import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Key } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import CodeBlock from '../components/ui/CodeBlock'
import { fetchApiKeys, createApiKey, revokeApiKey } from '../api/client'
import type { ApiKey } from '../api/client'

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'reveal'; key: string; name: string }
  | { type: 'revoke'; id: string; name: string }

export default function ApiKeys() {
  const navigate = useNavigate()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })
  const [newKeyName, setNewKeyName] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadKeys = useCallback(async () => {
    try {
      const data = await fetchApiKeys()
      setKeys(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadKeys() }, [loadKeys])

  const handleCreate = async () => {
    setActionLoading(true)
    setFormError(null)
    try {
      const created = await createApiKey(newKeyName.trim() || 'Default')
      setNewKeyName('')
      setModal({ type: 'reveal', key: created.key, name: created.name })
      loadKeys()
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Failed to create key')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setActionLoading(true)
    try {
      await revokeApiKey(id)
      setModal({ type: 'closed' })
      loadKeys()
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-ink">API Keys</h1>
          <p className="text-sm text-ink-muted mt-1">
            Manage keys used to authenticate proxy requests.
          </p>
        </div>
        <Button onClick={() => setModal({ type: 'create' })}>
          <Plus size={15} />
          New key
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : keys.length === 0 ? (
        <div className="border border-stroke border-dashed rounded-xl flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center mb-4">
            <Key size={20} className="text-ink-faint" />
          </div>
          <p className="text-sm font-medium text-ink mb-1">No API keys yet</p>
          <p className="text-xs text-ink-muted mb-5">
            Create your first key to start proxying LLM requests through Cachex.
          </p>
          <Button onClick={() => setModal({ type: 'create' })}>
            <Plus size={15} />
            Create API key
          </Button>
        </div>
      ) : (
        <div className="bg-surface border border-stroke rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke">
                <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Name</th>
                <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Key</th>
                <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Created</th>
                <th className="text-left px-5 py-3 text-xs text-ink-muted font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-stroke/50 last:border-0 hover:bg-elevated/40">
                  <td className="px-5 py-3.5 text-ink font-medium">{k.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink-muted">{k.key_prefix}••••••••</td>
                  <td className="px-5 py-3.5 text-ink-muted">
                    {new Date(k.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={k.status === 'active' ? 'teal' : 'danger'}>
                      {k.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setModal({ type: 'revoke', id: k.id, name: k.name })}
                      className="text-ink-faint hover:text-danger transition-colors"
                      title="Revoke key"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={modal.type === 'create'}
        onClose={() => { setModal({ type: 'closed' }); setFormError(null); setNewKeyName('') }}
        title="Create API key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal({ type: 'closed' })}>
              Cancel
            </Button>
            <Button loading={actionLoading} onClick={handleCreate}>
              Create key
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Key name"
            placeholder="e.g. Production, Development"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            hint="Optional — helps you identify this key later."
            autoFocus
          />
          {formError && <p className="text-xs text-danger">{formError}</p>}
        </div>
      </Modal>

      {/* Reveal modal — shown once after creation */}
      <Modal
        open={modal.type === 'reveal'}
        onClose={() => setModal({ type: 'closed' })}
        title="Your new API key"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModal({ type: 'closed' })}
            >
              Done
            </Button>
            <Button
              onClick={() => {
                if (modal.type === 'reveal') {
                  navigate('/dashboard/quickstart', { state: { key: modal.key } })
                }
              }}
            >
              Quick-start guide →
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">
            Copy this key now — it won't be shown again.
          </p>
          <CodeBlock
            code={modal.type === 'reveal' ? modal.key : ''}
            language="API key"
          />
          <p className="text-xs text-ink-faint">
            Store it somewhere safe like a password manager or secrets vault.
          </p>
        </div>
      </Modal>

      {/* Revoke confirmation modal */}
      <Modal
        open={modal.type === 'revoke'}
        onClose={() => setModal({ type: 'closed' })}
        title="Revoke API key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal({ type: 'closed' })}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={actionLoading}
              onClick={() => modal.type === 'revoke' && handleRevoke(modal.id)}
            >
              Revoke key
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          This will immediately invalidate{' '}
          <span className="text-ink font-medium">
            {modal.type === 'revoke' ? modal.name : ''}
          </span>
          . Any requests using this key will fail.
        </p>
      </Modal>
    </div>
  )
}
