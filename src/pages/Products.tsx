import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products'
import { getCategories } from '../api/products'
import { PageSpinner } from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import toast from 'react-hot-toast'

const emptyForm = { product_name: '', barcode: '', category: '', price: '', cost_price: '', quantity: '', reorder_level: '' }

export default function Products() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => getProducts({ search }),
  })
  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: getCategories })

  const products = data?.data?.results || data?.data || []
  const categories = catData?.data?.results || catData?.data || []

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setModal(true) }
  const openEdit = (p: any) => {
    setEditing(p)
    setForm({
      product_name: p.product_name,
      barcode: p.barcode || '',
      category: String(p.category),
      price: String(p.price),
      cost_price: String(p.cost_price),
      quantity: String(p.quantity),
      reorder_level: String(p.reorder_level),
    })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, barcode: form.barcode || null, category: Number(form.category), price: parseFloat(form.price), cost_price: parseFloat(form.cost_price), quantity: parseInt(form.quantity), reorder_level: parseInt(form.reorder_level) }
      if (editing) await updateProduct(editing.product_id || editing.id, payload)
      else await createProduct(payload)
      toast.success(editing ? 'Product updated' : 'Product created')
      qc.invalidateQueries({ queryKey: ['products'] })
      setModal(false)
    } catch (err: any) {
      toast.error(JSON.stringify(err?.response?.data || 'Error'))
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try { await deleteProduct(id); qc.invalidateQueries({ queryKey: ['products'] }); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} items</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}><Plus size={15} />Add Product</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="No products yet" description="Add your first product to get started" action={<button type="button" className="btn-primary" onClick={openNew}><Plus size={14} />Add Product</button>} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="th">Product</th>
                <th className="th">Category</th>
                <th className="th">Price</th>
                <th className="th">Cost</th>
                <th className="th">Stock</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.product_id || p.id} className="tr">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center text-accent text-xs font-bold shrink-0">
                        {p.product_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.product_name}</p>
                        {p.barcode && <p className="text-xs text-gray-400">{p.barcode}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="td">{p.category_name || p.category}</td>
                  <td className="td font-medium">GHS {parseFloat(p.price).toFixed(2)}</td>
                  <td className="td text-gray-400">GHS {parseFloat(p.cost_price).toFixed(2)}</td>
                  <td className="td">{p.quantity}</td>
                  <td className="td">
                    {p.quantity <= (p.reorder_level || 0)
                      ? <span className="badge-red">Low Stock</span>
                      : <span className="badge-green">In Stock</span>}
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Edit product" onClick={() => openEdit(p)} className="btn-ghost p-1.5"><Edit2 size={13} /></button>
                      <button type="button" aria-label="Delete product" onClick={() => handleDelete(p.product_id || p.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'New Product'}>
        <div className="space-y-4">
          {[
            { label: 'Product Name', key: 'product_name', type: 'text' },
            { label: 'Barcode (optional)', key: 'barcode', type: 'text' },
            { label: 'Price (GHS)', key: 'price', type: 'number' },
            { label: 'Cost Price (GHS)', key: 'cost_price', type: 'number' },
            { label: 'Quantity', key: 'quantity', type: 'number' },
            { label: 'Reorder Level', key: 'reorder_level', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input id={`product-${key}`} aria-label={label} className="input" type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
            <select aria-label="Category" className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((c: any) => <option key={c.category_id || c.id} value={c.category_id || c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
