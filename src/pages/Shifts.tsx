import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Play, StopCircle } from 'lucide-react'
import { getShifts, startShift, endShift } from '../api/shifts'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Shifts() {
  const qc = useQueryClient()
  const [startModal, setStartModal] = useState(false)
  const [endModal, setEndModal] = useState<number | null>(null)
  const [openingFloat, setOpeningFloat] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['shifts'], queryFn: getShifts })
  const shifts = data?.data?.results || data?.data || []

  const handleStart = async () => {
    setSaving(true)
    try {
      await startShift({ opening_float: parseFloat(openingFloat) || 0 })
      toast.success('Shift started')
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setStartModal(false)
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  const handleEnd = async (id: number) => {
    setSaving(true)
    try {
      await endShift(id, { closing_cash: parseFloat(closingCash) || 0 })
      toast.success('Shift ended')
      qc.invalidateQueries({ queryKey: ['shifts'] })
      setEndModal(null)
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  const statusColor: Record<string, string> = { open: 'badge-green', closed: 'badge-gray' }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shifts</h1>
        <button type="button" className="btn-primary" onClick={() => setStartModal(true)}><Play size={15} />Start Shift</button>
      </div>
      <div className="card">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Cashier</th><th className="th">Start</th><th className="th">End</th><th className="th">Float</th><th className="th">Sales</th><th className="th">Status</th><th className="th"></th></tr></thead>
          <tbody>
            {shifts.map((s: any) => (
              <tr key={s.id} className="tr">
                <td className="td font-medium">{s.cashier_name || s.cashier || '—'}</td>
                <td className="td text-gray-500">{s.start_time ? new Date(s.start_time).toLocaleString() : '—'}</td>
                <td className="td text-gray-500">{s.end_time ? new Date(s.end_time).toLocaleString() : '—'}</td>
                <td className="td">GHS {parseFloat(s.opening_float || 0).toFixed(2)}</td>
                <td className="td">GHS {parseFloat(s.total_sales || 0).toFixed(2)}</td>
                <td className="td"><span className={statusColor[s.status] || 'badge-gray'}>{s.status}</span></td>
                <td className="td">
                  {s.status === 'open' && (
                    <button type="button" className="btn-secondary text-xs py-1 px-3" onClick={() => setEndModal(s.id)}><StopCircle size={12} />End</button>
                  )}
                </td>
              </tr>
            ))}
            {shifts.length === 0 && <tr><td colSpan={7} className="td text-center text-gray-400 py-8">No shifts recorded</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={startModal} onClose={() => setStartModal(false)} title="Start Shift" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Opening Float (GHS)</label>
            <input className="input" type="number" step="0.01" placeholder="0.00" value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setStartModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleStart} disabled={saving}>{saving ? 'Starting…' : 'Start Shift'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={endModal !== null} onClose={() => setEndModal(null)} title="End Shift" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Closing Cash Count (GHS)</label>
            <input className="input" type="number" step="0.01" placeholder="0.00" value={closingCash} onChange={e => setClosingCash(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setEndModal(null)}>Cancel</button>
            <button type="button" className="btn-danger" onClick={() => endModal && handleEnd(endModal)} disabled={saving}>{saving ? 'Ending…' : 'End Shift'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
