import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateSettings, changePassword } from '../api/auth'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Settings() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'general' | 'security'>('general')
  const [form, setForm] = useState<Record<string, any>>({})
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm_new_password: '' })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings, retry: 1 })

  useEffect(() => {
    if (data?.data) setForm(data.data)
  }, [data])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(form)
      toast.success('Settings saved')
      qc.invalidateQueries({ queryKey: ['settings'] })
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleChangePass = async () => {
    setSaving(true)
    try {
      await changePassword(passForm)
      toast.success('Password changed')
      setPassForm({ old_password: '', new_password: '', confirm_new_password: '' })
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  const fields = [
    { label: 'Store Name', key: 'store_name' },
    { label: 'Store Address', key: 'store_address' },
    { label: 'Store Phone', key: 'store_phone' },
    { label: 'Store Email', key: 'store_email' },
    { label: 'Tax Rate (%)', key: 'tax_rate', type: 'number' },
    { label: 'Currency Symbol', key: 'currency_symbol' },
    { label: 'Receipt Footer', key: 'receipt_footer' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {([{ key: 'general', label: 'General' }, { key: 'security', label: 'Security' }] as const).map(t => (
          <button type="button" key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card space-y-4">
          {fields.map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                className="input"
                type={type || 'text'}
                value={form[key] ?? ''}
                aria-label={label}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="pt-2">
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card space-y-4">
          <p className="text-sm text-gray-500 mb-2">Change your account password.</p>
          {[{ label: 'Current Password', key: 'old_password' }, { label: 'New Password', key: 'new_password' }, { label: 'Confirm New Password', key: 'confirm_new_password' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type="password" aria-label={label} value={(passForm as any)[key]} onChange={e => setPassForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="pt-2">
            <button type="button" className="btn-primary" onClick={handleChangePass} disabled={saving}>{saving ? 'Updating…' : 'Change Password'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
