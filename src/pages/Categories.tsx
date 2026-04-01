import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Boxes } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/products'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Categories() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const categories = data?.data?.results || data?.data || []

  const open = (c?: any) => {
    setEditing(c || null)
    setName(c?.name || '')
    setDescription(c?.description || '')
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await updateCategory(editing.category_id || editing.id, { name, description })
      else await createCategory({ name, description })
      toast.success(editing ? 'Updated' : 'Created')
      qc.invalidateQueries({ queryKey: ['categories'] })
      setModal(false)
    } catch (err: any) {
      toast.error(JSON.stringify(err?.response?.data || 'Error'))
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete category?')) return
    try { await deleteCategory(id); qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button type="button" className="btn-primary" onClick={() => open()}><Plus size={15} />Add Category</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.length === 0
          ? <div className="col-span-full"><EmptyState icon={<Boxes size={28} />} title="No categories yet" action={<button type="button" className="btn-primary" onClick={() => open()}><Plus size={14} />Add Category</button>} /></div>
          : categories.map((c: any) => (
            <div key={c.category_id || c.id} className="card flex items-start justify-between gap-3">
              <div>
                <div className="w-9 h-9 bg-accent-light rounded-xl flex items-center justify-center text-accent font-bold text-sm mb-3">
                  {c.name.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" aria-label="Edit category" className="btn-ghost p-1.5" onClick={() => open(c)}><Edit2 size={13} /></button>
                <button type="button" aria-label="Delete category" className="btn-ghost p-1.5 text-red-400 hover:text-red-600" onClick={() => handleDelete(c.category_id || c.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'New Category'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Beverages" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <input className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
