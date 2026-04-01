import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiKeys, createApiKey, deleteApiKey, rotateApiKey, getWebhooks, createWebhook, deleteWebhook, testWebhook } from '../api/misc'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import { Plus, Trash2, RefreshCw, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Integrations() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'apikeys' | 'webhooks'>('apikeys')
  const [keyModal, setKeyModal] = useState(false)
  const [webhookModal, setWebhookModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [webhookForm, setWebhookForm] = useState({ url: '', events: '', is_active: true })
  const [saving, setSaving] = useState(false)

  const { data: keysData, isLoading } = useQuery({ queryKey: ['api-keys'], queryFn: getApiKeys, retry: 1 })
  const { data: hooksData } = useQuery({ queryKey: ['webhooks'], queryFn: getWebhooks, retry: 1 })

  const apiKeys = keysData?.data?.results || keysData?.data || []
  const webhooks = hooksData?.data?.results || hooksData?.data || []

  const handleCreateKey = async () => {
    setSaving(true)
    try { await createApiKey({ name: keyName }); toast.success('API key created'); qc.invalidateQueries({ queryKey: ['api-keys'] }); setKeyModal(false) }
    catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleDeleteKey = async (id: number) => {
    if (!confirm('Delete API key?')) return
    try { await deleteApiKey(id); qc.invalidateQueries({ queryKey: ['api-keys'] }); toast.success('Deleted') }
    catch { toast.error('Failed') }
  }

  const handleRotate = async (id: number) => {
    try { await rotateApiKey(id); qc.invalidateQueries({ queryKey: ['api-keys'] }); toast.success('Key rotated') }
    catch { toast.error('Failed') }
  }

  const handleCreateWebhook = async () => {
    setSaving(true)
    try {
      await createWebhook({ ...webhookForm, events: webhookForm.events.split(',').map(e => e.trim()) })
      toast.success('Webhook created')
      qc.invalidateQueries({ queryKey: ['webhooks'] })
      setWebhookModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleTestWebhook = async (id: number) => {
    try { await testWebhook(id); toast.success('Test payload sent') }
    catch { toast.error('Failed') }
  }

  const handleDeleteWebhook = async (id: number) => {
    if (!confirm('Delete webhook?')) return
    try { await deleteWebhook(id); qc.invalidateQueries({ queryKey: ['webhooks'] }); toast.success('Deleted') }
    catch { toast.error('Failed') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Integrations</h1>
        <button type="button" className="btn-primary" onClick={() => tab === 'apikeys' ? setKeyModal(true) : setWebhookModal(true)}>
          <Plus size={15} />{tab === 'apikeys' ? 'New API Key' : 'New Webhook'}
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {([{ key: 'apikeys', label: 'API Keys' }, { key: 'webhooks', label: 'Webhooks' }] as const).map(t => (
          <button type="button" key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'apikeys' ? (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Name</th><th className="th">Key</th><th className="th">Created</th><th className="th"></th></tr></thead>
            <tbody>
              {apiKeys.map((k: any) => (
                <tr key={k.id} className="tr">
                  <td className="td font-medium">{k.name}</td>
                  <td className="td"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{k.key ? `${k.key.substring(0, 12)}…` : '••••••••'}</code></td>
                  <td className="td text-gray-400">{k.created_at ? new Date(k.created_at).toLocaleDateString() : '—'}</td>
                  <td className="td">
                    <div className="flex gap-2">
                      <button type="button" title="Rotate" className="btn-ghost p-1.5 text-amber-500" onClick={() => handleRotate(k.id)}><RefreshCw size={13} /></button>
                      <button type="button" title="Delete" className="btn-ghost p-1.5 text-red-400" onClick={() => handleDeleteKey(k.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {apiKeys.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No API keys</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">URL</th><th className="th">Events</th><th className="th">Active</th><th className="th"></th></tr></thead>
            <tbody>
              {webhooks.map((w: any) => (
                <tr key={w.id} className="tr">
                  <td className="td text-xs text-gray-500 max-w-xs truncate">{w.url}</td>
                  <td className="td text-xs">{Array.isArray(w.events) ? w.events.join(', ') : w.events}</td>
                  <td className="td"><span className={w.is_active ? 'badge-green' : 'badge-gray'}>{w.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="td">
                    <div className="flex gap-2">
                      <button type="button" title="Test" className="btn-ghost p-1.5 text-blue-400" onClick={() => handleTestWebhook(w.id)}><Send size={13} /></button>
                      <button type="button" title="Delete" className="btn-ghost p-1.5 text-red-400" onClick={() => handleDeleteWebhook(w.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {webhooks.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No webhooks registered</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={keyModal} onClose={() => setKeyModal(false)} title="Create API Key" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
            <input className="input" placeholder="e.g. Mobile App" value={keyName} onChange={e => setKeyName(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setKeyModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreateKey} disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={webhookModal} onClose={() => setWebhookModal(false)} title="Register Webhook" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Endpoint URL</label>
            <input className="input" placeholder="https://yourapp.com/webhook" value={webhookForm.url} onChange={e => setWebhookForm(f => ({ ...f, url: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Events (comma-separated)</label>
            <input className="input" placeholder="sale.completed, low_stock" value={webhookForm.events} onChange={e => setWebhookForm(f => ({ ...f, events: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setWebhookModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreateWebhook} disabled={saving}>{saving ? 'Registering…' : 'Register'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
