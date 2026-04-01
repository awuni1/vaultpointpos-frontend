import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { getExpenses, createExpense, deleteExpense, getExpenseCategories, createExpenseCategory } from '../api/expenses'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Expenses() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'expenses' | 'categories'>('expenses')
  const [modal, setModal] = useState(false)
  const [catModal, setCatModal] = useState(false)
  const [form, setForm] = useState({ category: '', amount: '', description: '', date: '' })
  const [catName, setCatName] = useState('')
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['expenses'], queryFn: getExpenses })
  const { data: catData } = useQuery({ queryKey: ['expense-cats'], queryFn: getExpenseCategories })

  const expenses = data?.data?.results || data?.data || []
  const categories = catData?.data?.results || catData?.data || []

  const handleCreate = async () => {
    setSaving(true)
    try {
      await createExpense({ ...form, category: Number(form.category), amount: parseFloat(form.amount) })
      toast.success('Expense recorded')
      qc.invalidateQueries({ queryKey: ['expenses'] })
      setModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleCreateCat = async () => {
    setSaving(true)
    try {
      await createExpenseCategory({ name: catName })
      toast.success('Category created')
      qc.invalidateQueries({ queryKey: ['expense-cats'] })
      setCatModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete expense?')) return
    try { await deleteExpense(id); qc.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Deleted') }
    catch { toast.error('Failed') }
  }

  if (isLoading) return <PageSpinner />

  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount || 0), 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="text-sm text-gray-400 mt-0.5">Total: GHS {totalExpenses.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setCatModal(true)}>Add Category</button>
          <button type="button" className="btn-primary" onClick={() => setModal(true)}><Plus size={15} />Add Expense</button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {(['expenses', 'categories'] as const).map(t => (
          <button type="button" key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'expenses' ? (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Description</th><th className="th">Category</th><th className="th">Amount</th><th className="th">Date</th><th className="th"></th></tr></thead>
            <tbody>
              {expenses.map((e: any) => (
                <tr key={e.id} className="tr">
                  <td className="td font-medium">{e.description}</td>
                  <td className="td">{e.category_name || e.category}</td>
                  <td className="td font-semibold text-red-600">GHS {parseFloat(e.amount).toFixed(2)}</td>
                  <td className="td text-gray-400">{e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
                  <td className="td">
                    <button type="button" title="Delete" className="btn-ghost p-1.5 text-red-400" onClick={() => handleDelete(e.id)}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No expenses recorded</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Category</th><th className="th">Icon</th></tr></thead>
            <tbody>
              {categories.map((c: any) => (
                <tr key={c.id} className="tr">
                  <td className="td font-medium">{c.name}</td>
                  <td className="td">{c.icon || '—'}</td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={2} className="td text-center text-gray-400 py-8">No categories</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Expense" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {[{ label: 'Amount (GHS)', key: 'amount', type: 'number' }, { label: 'Description', key: 'description' }, { label: 'Date', key: 'date', type: 'date' }].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type={type || 'text'} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={catModal} onClose={() => setCatModal(false)} title="Add Expense Category" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category Name</label>
            <input className="input" placeholder="e.g. Utilities" value={catName} onChange={e => setCatName(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setCatModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreateCat} disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
