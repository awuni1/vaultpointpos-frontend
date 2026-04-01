import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, CheckCircle } from 'lucide-react'
import { getSuppliers, createSupplier, getPurchaseOrders, createPurchaseOrder, approvePO } from '../api/suppliers'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Suppliers() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'suppliers' | 'orders'>('suppliers')
  const [supplierModal, setSupplierModal] = useState(false)
  const [poModal, setPoModal] = useState(false)
  const [supplierForm, setSupplierForm] = useState({ name: '', contact_person: '', phone: '', email: '', address: '' })
  const [poForm, setPoForm] = useState({ supplier: '', branch: '', notes: '', expected_delivery: '', product: '', quantity_ordered: '', unit_cost: '' })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers })
  const { data: poData } = useQuery({ queryKey: ['purchase-orders'], queryFn: getPurchaseOrders })

  const suppliers = data?.data?.results || data?.data || []
  const orders = poData?.data?.results || poData?.data || []

  const handleCreateSupplier = async () => {
    setSaving(true)
    try {
      await createSupplier(supplierForm)
      toast.success('Supplier created')
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      setSupplierModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleCreatePO = async () => {
    setSaving(true)
    try {
      await createPurchaseOrder({
        supplier: Number(poForm.supplier), branch: Number(poForm.branch), notes: poForm.notes, expected_delivery: poForm.expected_delivery,
        items: [{ product: Number(poForm.product), quantity_ordered: Number(poForm.quantity_ordered), unit_cost: parseFloat(poForm.unit_cost) }]
      })
      toast.success('Purchase order created')
      qc.invalidateQueries({ queryKey: ['purchase-orders'] })
      setPoModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleApprovePO = async (id: number) => {
    try { await approvePO(id); qc.invalidateQueries({ queryKey: ['purchase-orders'] }); toast.success('PO approved') }
    catch (err: any) { toast.error(err?.response?.data?.error || 'Error') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setPoModal(true)}>New PO</button>
          <button type="button" className="btn-primary" onClick={() => setSupplierModal(true)}><Plus size={15} />Add Supplier</button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {(['suppliers', 'orders'] as const).map(t => (
          <button type="button" key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t === 'orders' ? `Purchase Orders (${orders.length})` : `Suppliers (${suppliers.length})`}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'suppliers' ? (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Name</th><th className="th">Contact</th><th className="th">Phone</th><th className="th">Email</th></tr></thead>
            <tbody>
              {suppliers.map((s: any) => (
                <tr key={s.id} className="tr">
                  <td className="td font-medium">{s.name}</td>
                  <td className="td">{s.contact_person}</td>
                  <td className="td">{s.phone}</td>
                  <td className="td text-gray-500">{s.email}</td>
                </tr>
              ))}
              {suppliers.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No suppliers</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">PO #</th><th className="th">Supplier</th><th className="th">Total</th><th className="th">Expected</th><th className="th">Status</th><th className="th"></th></tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="tr">
                  <td className="td font-medium text-accent">{o.po_number || `#${o.id}`}</td>
                  <td className="td">{o.supplier_name || o.supplier}</td>
                  <td className="td font-semibold">GHS {parseFloat(o.total_amount || 0).toFixed(2)}</td>
                  <td className="td text-gray-400">{o.expected_delivery || '—'}</td>
                  <td className="td"><span className={`badge-${o.status === 'approved' ? 'green' : o.status === 'rejected' ? 'red' : o.status === 'received' ? 'blue' : 'yellow'}`}>{o.status}</span></td>
                  <td className="td">
                    {o.status === 'pending' && (
                      <button type="button" className="btn-secondary text-xs py-1 px-2" onClick={() => handleApprovePO(o.id)}><CheckCircle size={12} />Approve</button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="td text-center text-gray-400 py-8">No purchase orders</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={supplierModal} onClose={() => setSupplierModal(false)} title="New Supplier">
        <div className="space-y-4">
          {[{ label: 'Name', key: 'name' }, { label: 'Contact Person', key: 'contact_person' }, { label: 'Phone', key: 'phone' }, { label: 'Email', key: 'email' }, { label: 'Address', key: 'address' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" aria-label={label} value={(supplierForm as any)[key]} onChange={e => setSupplierForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setSupplierModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreateSupplier} disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={poModal} onClose={() => setPoModal(false)} title="Create Purchase Order">
        <div className="space-y-4">
          {[{ label: 'Supplier ID', key: 'supplier', type: 'number' }, { label: 'Branch ID', key: 'branch', type: 'number' }, { label: 'Product ID', key: 'product', type: 'number' }, { label: 'Quantity Ordered', key: 'quantity_ordered', type: 'number' }, { label: 'Unit Cost (GHS)', key: 'unit_cost', type: 'number' }, { label: 'Expected Delivery', key: 'expected_delivery', type: 'date' }, { label: 'Notes', key: 'notes' }].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type={type || 'text'} aria-label={label} value={(poForm as any)[key]} onChange={e => setPoForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setPoModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreatePO} disabled={saving}>{saving ? 'Saving…' : 'Create PO'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
