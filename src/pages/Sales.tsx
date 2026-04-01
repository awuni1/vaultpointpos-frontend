import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Eye, Ban, RefreshCw } from 'lucide-react'
import { getSales, getSale, voidSale, refundSale } from '../api/sales'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Sales() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [detailModal, setDetailModal] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['sales'], queryFn: () => getSales() })
  const { data: detailData } = useQuery({
    queryKey: ['sale', detailId],
    queryFn: () => getSale(detailId!),
    enabled: !!detailId,
  })

  const sales = data?.data?.results || data?.data || []
  const detail = detailData?.data

  const statusColor: Record<string, string> = {
    completed: 'badge-green',
    voided: 'badge-red',
    held: 'badge-yellow',
    refunded: 'badge-blue',
    pending: 'badge-gray',
  }

  const handleVoid = async (id: number) => {
    if (!confirm('Void this sale?')) return
    try { await voidSale(id); qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Sale voided') }
    catch (err: any) { toast.error(err?.response?.data?.error || 'Cannot void') }
  }

  const handleRefund = async (id: number) => {
    if (!confirm('Refund this sale?')) return
    try { await refundSale(id); qc.invalidateQueries({ queryKey: ['sales'] }); toast.success('Refund processed') }
    catch (err: any) { toast.error(err?.response?.data?.error || 'Cannot refund') }
  }

  const filtered = sales.filter((s: any) =>
    !search || String(s.id).includes(search) || (s.customer_name || '').toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales History</h1>
          <p className="text-sm text-gray-400 mt-0.5">{sales.length} transactions</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search by ID or customer…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Sale ID</th><th className="th">Date</th><th className="th">Customer</th><th className="th">Items</th><th className="th">Total</th><th className="th">Payment</th><th className="th">Status</th><th className="th"></th></tr></thead>
          <tbody>
            {filtered.map((s: any) => (
              <tr key={s.id} className="tr">
                <td className="td font-medium text-accent">#{s.id}</td>
                <td className="td text-gray-500">{s.sale_date ? new Date(s.sale_date).toLocaleString() : '—'}</td>
                <td className="td">{s.customer_name || '—'}</td>
                <td className="td">{s.items?.length || s.item_count || '—'}</td>
                <td className="td font-semibold">GHS {parseFloat(s.total_amount || 0).toFixed(2)}</td>
                <td className="td capitalize">{s.payment_method || '—'}</td>
                <td className="td"><span className={statusColor[s.status] || 'badge-gray'}>{s.status}</span></td>
                <td className="td">
                  <div className="flex gap-1">
                    <button type="button" title="View" className="btn-ghost p-1.5" onClick={() => { setDetailId(s.id); setDetailModal(true) }}><Eye size={13} /></button>
                    {s.status === 'completed' && (
                      <>
                        <button type="button" title="Void" className="btn-ghost p-1.5 text-red-400" onClick={() => handleVoid(s.id)}><Ban size={13} /></button>
                        <button type="button" title="Refund" className="btn-ghost p-1.5 text-blue-400" onClick={() => handleRefund(s.id)}><RefreshCw size={13} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="td text-center text-gray-400 py-8">No sales found</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={detailModal} onClose={() => setDetailModal(false)} title={`Sale #${detailId}`} size="lg">
        {detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium">{new Date(detail.sale_date).toLocaleString()}</p></div>
              <div><p className="text-gray-400 text-xs">Status</p><span className={statusColor[detail.status] || 'badge-gray'}>{detail.status}</span></div>
              <div><p className="text-gray-400 text-xs">Customer</p><p className="font-medium">{detail.customer_name || '—'}</p></div>
              <div><p className="text-gray-400 text-xs">Payment</p><p className="font-medium capitalize">{detail.payment_method}</p></div>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Qty</th><th className="th">Price</th><th className="th">Total</th></tr></thead>
              <tbody>
                {(detail.items || []).map((item: any, i: number) => (
                  <tr key={i} className="tr">
                    <td className="td">{item.product_name || item.product}</td>
                    <td className="td">{item.quantity}</td>
                    <td className="td">GHS {parseFloat(item.unit_price || item.price || 0).toFixed(2)}</td>
                    <td className="td font-medium">GHS {parseFloat(item.total_price || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right space-y-1 text-sm">
              <div className="flex justify-end gap-8"><span className="text-gray-400">Subtotal</span><span>GHS {parseFloat(detail.subtotal || detail.total_amount || 0).toFixed(2)}</span></div>
              <div className="flex justify-end gap-8 font-bold text-base pt-1 border-t border-gray-100"><span>Total</span><span>GHS {parseFloat(detail.total_amount || 0).toFixed(2)}</span></div>
            </div>
          </div>
        ) : <div className="py-8 text-center text-gray-400">Loading…</div>}
      </Modal>
    </div>
  )
}
