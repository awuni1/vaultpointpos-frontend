import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Key } from 'lucide-react'
import { getUsers, registerUser, updateUser, adminResetPassword } from '../api/auth'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const ROLE_COLORS: Record<string, string> = { admin: 'badge-indigo', manager: 'badge-blue', cashier: 'badge-green' }

export default function Staff() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [resetModal, setResetModal] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ username: '', full_name: '', email: '', role: 'cashier', password: '', confirm_password: '' })
  const [newPass, setNewPass] = useState('')
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers })
  const users = data?.data?.results || data?.data || []

  const open = (u?: any) => {
    setEditing(u || null)
    setForm(u ? { username: u.username, full_name: u.full_name, email: u.email, role: u.role, password: '', confirm_password: '' } : { username: '', full_name: '', email: '', role: 'cashier', password: '', confirm_password: '' })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await updateUser(editing.user_id, { full_name: form.full_name, email: form.email, role: form.role })
      else await registerUser(form)
      toast.success(editing ? 'Updated' : 'Staff member created')
      qc.invalidateQueries({ queryKey: ['users'] })
      setModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleReset = async () => {
    if (!resetModal) return
    setSaving(true)
    try {
      await adminResetPassword(resetModal, { new_password: newPass })
      toast.success('Password reset')
      setResetModal(null)
      setNewPass('')
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} members</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => open()}><Plus size={15} />Add Staff</button>
      </div>
      <div className="card">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Name</th><th className="th">Username</th><th className="th">Email</th><th className="th">Role</th><th className="th"></th></tr></thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.user_id} className="tr">
                <td className="td">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      {u.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium text-gray-900">{u.full_name}</span>
                  </div>
                </td>
                <td className="td text-gray-500">{u.username}</td>
                <td className="td text-gray-500">{u.email}</td>
                <td className="td"><span className={ROLE_COLORS[u.role] || 'badge-gray'}>{u.role}</span></td>
                <td className="td">
                  <div className="flex gap-2">
                    <button type="button" title="Edit" className="btn-ghost p-1.5" onClick={() => open(u)}><Edit2 size={13} /></button>
                    <button type="button" title="Reset Password" className="btn-ghost p-1.5 text-amber-500" onClick={() => setResetModal(u.user_id)}><Key size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No staff members</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Staff Member' : 'Add Staff Member'}>
        <div className="space-y-4">
          {!editing && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Username</label>
              <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
          )}
          {[{ label: 'Full Name', key: 'full_name' }, { label: 'Email', key: 'email' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
            <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {['admin', 'manager', 'cashier'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {!editing && [{ label: 'Password', key: 'password' }, { label: 'Confirm Password', key: 'confirm_password' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type="password" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!resetModal} onClose={() => setResetModal(null)} title="Reset Password" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
            <input className="input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setResetModal(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleReset} disabled={saving}>{saving ? 'Resetting…' : 'Reset'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
