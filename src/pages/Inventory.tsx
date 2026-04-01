import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Plus } from 'lucide-react'
import { getInventory, adjustStock, getLowStock, getMovements } from '../api/inventory'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Inventory() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'all' | 'low' | 'movements'>('all')
  const [adjustModal, setAdjustModal] = useState(false)
  const [adjustForm, setAdjustForm] = useState({ product_id: '', quantity_change: '', reason: '' })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['inventory'], queryFn: getInventory })
  const { data: lowData } = useQuery({ queryKey: ['low-stock'], queryFn: getLowStock })
  const { data: movData } = useQuery({ queryKey: ['movements'], queryFn: getMovements })

  const inventory = data?.data?.results || data?.data || []
  const lowStock = lowData?.data?.results || lowData?.data || []
  const movements = movData?.data?.results || movData?.data || []

  const handleAdjust = async () => {
    setSaving(true)
    try {
      await adjustStock({ product_id: Number(adjustForm.product_id), quantity_change: Number(adjustForm.quantity_change), reason: adjustForm.reason })
      toast.success('Stock adjusted')
      qc.invalidateQueries({ queryKey: ['inventory'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      setAdjustModal(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to adjust stock')
    } finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  const tabs = [{ key: 'all', label: 'All Stock' }, { key: 'low', label: `Low Stock (${lowStock.length})` }, { key: 'movements', label: 'Movements' }]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <button type="button" className="btn-primary" onClick={() => setAdjustModal(true)}><Plus size={15} />Adjust Stock</button>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {tabs.map(t => (
          <button
            type="button"
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'all' && (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Qty</th><th className="th">Reorder Level</th><th className="th">Status</th></tr></thead>
            <tbody>
              {inventory.map((item: any) => (
                <tr key={item.id || item.product_id} className="tr">
                  <td className="td font-medium">{item.product_name || item.product}</td>
                  <td className="td">{item.quantity}</td>
                  <td className="td">{item.reorder_level}</td>
                  <td className="td">
                    {item.quantity <= (item.reorder_level || 0)
                      ? <span className="badge-red"><AlertTriangle size={10} className="mr-1" />Low</span>
                      : <span className="badge-green">OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'low' && (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Qty</th><th className="th">Reorder Level</th><th className="th">Deficit</th></tr></thead>
            <tbody>
              {lowStock.map((item: any) => (
                <tr key={item.id} className="tr">
                  <td className="td font-medium">{item.product_name || item.product}</td>
                  <td className="td text-red-600 font-semibold">{item.quantity}</td>
                  <td className="td">{item.reorder_level}</td>
                  <td className="td text-red-500">{Math.max(0, (item.reorder_level || 0) - item.quantity)}</td>
                </tr>
              ))}
              {lowStock.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">All items are well stocked</td></tr>}
            </tbody>
          </table>
        )}
        {tab === 'movements' && (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Change</th><th className="th">Reason</th><th className="th">Date</th></tr></thead>
            <tbody>
              {movements.map((m: any) => (
                <tr key={m.id} className="tr">
                  <td className="td font-medium">{m.product_name || m.product}</td>
                  <td className="td">
                    <span className={m.quantity_change > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                      {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                    </span>
                  </td>
                  <td className="td text-gray-500">{m.reason || m.movement_type}</td>
                  <td className="td text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={adjustModal} onClose={() => setAdjustModal(false)} title="Adjust Stock" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Product ID</label>
            <input id="adjust-product-id" aria-label="Product ID" className="input" type="number" value={adjustForm.product_id} onChange={e => setAdjustForm(f => ({ ...f, product_id: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Quantity Change (negative to reduce)</label>
            <input id="adjust-qty" aria-label="Quantity Change" className="input" type="number" value={adjustForm.quantity_change} onChange={e => setAdjustForm(f => ({ ...f, quantity_change: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Reason</label>
            <input className="input" value={adjustForm.reason} onChange={e => setAdjustForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Stock correction" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setAdjustModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleAdjust} disabled={saving}>{saving ? 'Saving…' : 'Adjust'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
