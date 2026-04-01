import { useQuery } from '@tanstack/react-query'
import { getPayments, getCashReconciliation } from '../api/misc'
import { PageSpinner } from '../components/ui/Spinner'

export default function Payments() {
  const { data, isLoading } = useQuery({ queryKey: ['payments'], queryFn: getPayments, retry: 1 })
  const { data: recon } = useQuery({ queryKey: ['reconciliation'], queryFn: getCashReconciliation, retry: 1 })

  const payments = data?.data?.results || data?.data || []
  const reconData = recon?.data || {}

  if (isLoading) return <PageSpinner />

  const METHOD_COLOR: Record<string, string> = { cash: 'badge-green', momo: 'badge-blue', card: 'badge-indigo' }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
      </div>

      {reconData && Object.keys(reconData).length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(reconData).slice(0, 4).map(([key, val]) => (
            <div key={key} className="card">
              <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{typeof val === 'number' ? `GHS ${val.toFixed(2)}` : String(val)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <p className="text-sm font-semibold text-gray-900 mb-4">Payment Records</p>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Sale #</th><th className="th">Method</th><th className="th">Amount</th><th className="th">Date</th><th className="th">Status</th></tr></thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="tr">
                <td className="td font-medium text-accent">#{p.sale || p.sale_id}</td>
                <td className="td"><span className={METHOD_COLOR[p.payment_method] || 'badge-gray capitalize'}>{p.payment_method}</span></td>
                <td className="td font-semibold">GHS {parseFloat(p.amount || p.amount_paid || 0).toFixed(2)}</td>
                <td className="td text-gray-400">{p.created_at ? new Date(p.created_at).toLocaleString() : '—'}</td>
                <td className="td"><span className="badge-green">{p.status || 'completed'}</span></td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No payment records</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
