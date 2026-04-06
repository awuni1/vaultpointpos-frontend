import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Key, UserPlus, Users, ShieldCheck, LayoutDashboard } from 'lucide-react'
import { getUsers, registerUser, updateUser, adminResetPassword } from '../api/auth'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const ROLE_COLORS: Record<string, string> = {
  admin:    'badge-indigo',
  manager:  'badge-blue',
  cashier:  'badge-green',
}

const ROLE_TABS = [
  { key: 'all',     label: 'All Staff',  icon: Users },
  { key: 'cashier', label: 'Cashiers',   icon: UserPlus },
  { key: 'manager', label: 'Managers',   icon: LayoutDashboard },
  { key: 'admin',   label: 'Admins',     icon: ShieldCheck },
]

const emptyForm = { username: '', full_name: '', email: '', role: 'cashier', password: '', confirm_password: '' }

export default function Staff() {
  const qc = useQueryClient()
  const [roleFilter, setRoleFilter] = useState('all')
  const [modal, setModal]           = useState(false)
  const [resetModal, setResetModal] = useState<string | null>(null)
  const [editing, setEditing]       = useState<any>(null)
  const [form, setForm]             = useState({ ...emptyForm })
  const [newPass, setNewPass]       = useState('')
  const [saving, setSaving]         = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers })
  const users: any[] = data?.data?.results || data?.data || []

  const filtered = roleFilter === 'all' ? users : users.filter((u: any) => u.role === roleFilter)

  const open = (u?: any, defaultRole = 'cashier') => {
    setEditing(u || null)
    setForm(u
      ? { username: u.username, full_name: u.full_name, email: u.email, role: u.role, password: '', confirm_password: '' }
      : { ...emptyForm, role: defaultRole }
    )
    setModal(true)
  }

  const handleSave = async () => {
    if (!editing && form.password !== form.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      if (editing) await updateUser(editing.user_id, { full_name: form.full_name, email: form.email, role: form.role })
      else await registerUser(form)
      toast.success(editing ? 'Updated' : `${form.role.charAt(0).toUpperCase() + form.role.slice(1)} created`)
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

  const cashierCount = users.filter((u: any) => u.role === 'cashier').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#778DA9', margin: '0 0 4px' }}>
            Team Management
          </p>
          <h1 style={{ fontFamily: 'Manrope, Inter, sans-serif', fontSize: 24, fontWeight: 800, color: '#1B263B', margin: 0 }}>
            Staff
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => open(undefined, 'cashier')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              fontSize: 12, fontWeight: 700, color: '#2563EB', cursor: 'pointer',
            }}
          >
            <UserPlus size={14} /> Create Cashier
          </button>
          <button
            type="button"
            onClick={() => open()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              background: '#1B263B', border: '1px solid #1B263B',
              fontSize: 12, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {ROLE_TABS.map(({ key, label, icon: Icon }) => {
          const count = key === 'all' ? users.length : users.filter((u: any) => u.role === key).length
          const active = roleFilter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setRoleFilter(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                background: active ? '#1B263B' : '#FFFFFF',
                border: `1px solid ${active ? '#1B263B' : '#E2E8F0'}`,
                boxShadow: active ? '0 2px 10px rgba(27,38,59,0.2)' : '0 1px 4px rgba(27,38,59,0.05)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: active ? 'rgba(255,255,255,0.12)' : '#F5F7FA',
                border: `1px solid ${active ? 'rgba(255,255,255,0.2)' : '#E2E8F0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: active ? 'white' : '#415A77',
              }}>
                <Icon size={15} />
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: active ? '#FFFFFF' : '#1B263B', margin: 0, lineHeight: 1, fontFamily: 'Manrope, Inter, sans-serif' }}>{count}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: active ? 'rgba(255,255,255,0.6)' : '#94A3B8', margin: '2px 0 0', letterSpacing: '0.04em' }}>{label}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 1px 8px rgba(27,38,59,0.06)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1B263B' }}>
            {roleFilter === 'all' ? 'All Members' : `${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}s`}
            <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8', marginLeft: 8 }}>{filtered.length} total</span>
          </span>
          {roleFilter === 'cashier' && (
            <button
              type="button"
              onClick={() => open(undefined, 'cashier')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Plus size={11} /> Add Cashier
            </button>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Username', 'Email', 'Role', ''].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', borderBottom: '1px solid #F1F5F9' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u: any) => (
              <tr
                key={u.user_id}
                style={{ borderBottom: '1px solid #F8FAFC', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F8FAFC'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'linear-gradient(135deg, #1B263B, #415A77)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {u.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1B263B', margin: 0 }}>{u.full_name}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 12, color: '#778DA9' }}>{u.username}</td>
                <td style={{ padding: '12px 20px', fontSize: 12, color: '#778DA9' }}>{u.email || '—'}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span className={ROLE_COLORS[u.role] || 'badge-gray'}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button" title="Edit"
                      onClick={() => open(u)}
                      style={{ width: 28, height: 28, borderRadius: 7, background: '#F5F7FA', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#415A77', cursor: 'pointer' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button" title="Reset Password"
                      onClick={() => setResetModal(u.user_id)}
                      style={{ width: 28, height: 28, borderRadius: 7, background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', cursor: 'pointer' }}
                    >
                      <Key size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 12px' }}>
                    {roleFilter === 'cashier' ? 'No cashiers yet' : 'No staff members'}
                  </p>
                  {roleFilter === 'cashier' && (
                    <button
                      type="button"
                      onClick={() => open(undefined, 'cashier')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: '#1B263B', border: 'none', fontSize: 12, fontWeight: 600, color: 'white', cursor: 'pointer' }}
                    >
                      <UserPlus size={13} /> Create First Cashier
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Staff Member' : form.role === 'cashier' ? 'Create Cashier' : 'Add Staff Member'}>
        <div className="space-y-4">
          {!editing && (
            <div>
              <label style={labelStyle}>Username</label>
              <input className="input" placeholder="e.g. john_cashier" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input className="input" placeholder="John Smith" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input className="input" type="email" placeholder="john@store.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {['cashier', 'manager', 'admin'].map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          {!editing && (
            <>
              <div>
                <label style={labelStyle}>Password</label>
                <input className="input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input className="input" type="password" value={form.confirm_password} onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))} />
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)}`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset password modal */}
      <Modal open={!!resetModal} onClose={() => setResetModal(null)} title="Reset Password" size="sm">
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>New Password</label>
            <input className="input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn-secondary" onClick={() => setResetModal(null)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleReset} disabled={saving}>
              {saving ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cashier count info */}
      {cashierCount > 0 && (
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 12, textAlign: 'right' }}>
          {cashierCount} active cashier{cashierCount !== 1 ? 's' : ''} on terminal
        </p>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: '#778DA9', marginBottom: 6,
}
