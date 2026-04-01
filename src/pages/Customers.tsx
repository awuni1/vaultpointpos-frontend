import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Users, History } from 'lucide-react'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomerHistory } from '../api/customers'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const empty = { full_name: '', phone: '', email: '', birthday: '' }

export default function Customers() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [historyModal, setHistoryModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...empty })
  const [saving, setSaving] = useState(false)
  const [historyId, setHistoryId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({ queryKey: ['customers', search], queryFn: () => getCustomers({ search }) })
  const { data: histData } = useQuery({
    queryKey: ['customer-history', historyId],
    queryFn: () => getCustomerHistory(historyId!),
    enabled: !!historyId,
  })

  const customers = data?.data?.results || data?.data || []
  const history = histData?.data?.results || histData?.data || []

  const open = (c?: any) => {
    setEditing(c || null)
    setForm(c ? { full_name: c.full_name, phone: c.phone || '', email: c.email || '', birthday: c.birthday || '' } : { ...empty })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await updateCustomer(editing.customer_id, form)
      else await createCustomer(form)
      toast.success(editing ? 'Updated' : 'Customer created')
      qc.invalidateQueries({ queryKey: ['customers'] })
      setModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete customer?')) return
    try { await deleteCustomer(id); qc.invalidateQueries({ queryKey: ['customers'] }); toast.success('Deleted') }
    catch { toast.error('Failed') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} registered</p>
        </div>
        <button className="btn-primary" onClick={() => open()}><Plus size={15} />Add Customer</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {customers.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No customers yet" action={<button className="btn-primary" onClick={() => open()}><Plus size={14} />Add Customer</button>} />
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Name</th><th className="th">Phone</th><th className="th">Email</th><th className="th">Points</th><th className="th"></th></tr></thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.customer_id} className="tr">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-bold shrink-0">
                        {c.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{c.full_name}</span>
                    </div>
                  </td>
                  <td className="td">{c.phone || '—'}</td>
                  <td className="td text-gray-500">{c.email || '—'}</td>
                  <td className="td">{c.loyalty_points || 0}</td>
                  <td className="td">
                    <div className="flex gap-2">
                      <button type="button" title="History" className="btn-ghost p-1.5" onClick={() => { setHistoryId(c.customer_id); setHistoryModal(true) }}><History size={13} /></button>
                      <button type="button" title="Edit" className="btn-ghost p-1.5" onClick={() => open(c)}><Edit2 size={13} /></button>
                      <button type="button" title="Delete" className="btn-ghost p-1.5 text-red-400" onClick={() => handleDelete(c.customer_id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Customer' : 'New Customer'} size="sm">
        <div className="space-y-4">
          {[
            { label: 'Full Name', key: 'full_name' },
            { label: 'Phone', key: 'phone' },
            { label: 'Email', key: 'email' },
            { label: 'Birthday', key: 'birthday', type: 'date' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input id={`customer-${key}`} aria-label={label} className="input" type={type || 'text'} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={historyModal} onClose={() => setHistoryModal(false)} title="Purchase History" size="lg">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Sale ID</th><th className="th">Date</th><th className="th">Total</th><th className="th">Status</th></tr></thead>
          <tbody>
            {history.map((s: any) => (
              <tr key={s.id} className="tr">
                <td className="td">#{s.id}</td>
                <td className="td">{s.sale_date ? new Date(s.sale_date).toLocaleDateString() : '—'}</td>
                <td className="td font-medium">GHS {parseFloat(s.total_amount || 0).toFixed(2)}</td>
                <td className="td"><span className={`badge-${s.status === 'completed' ? 'green' : s.status === 'voided' ? 'red' : 'gray'}`}>{s.status}</span></td>
              </tr>
            ))}
            {history.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No purchase history</td></tr>}
          </tbody>
        </table>
      </Modal>
    </div>
  )
}
