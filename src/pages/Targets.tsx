import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTargets, createTarget, getLeaderboard, getMyAchievements } from '../api/misc'
import { PageSpinner } from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import { Trophy, Target, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Targets() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ cashier: '', period_type: 'monthly', target_amount: '', start_date: '', end_date: '' })

  const { data: targetsData, isLoading } = useQuery({ queryKey: ['targets'], queryFn: getTargets, retry: 1 })
  const { data: leaderData } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard, retry: 1 })
  const { data: achieveData } = useQuery({ queryKey: ['my-achievements'], queryFn: getMyAchievements, retry: 1 })

  const targets = Array.isArray(targetsData?.data?.results) ? targetsData.data.results
    : Array.isArray(targetsData?.data) ? targetsData.data : []
  const leaders = Array.isArray(leaderData?.data?.leaderboard) ? leaderData.data.leaderboard
    : Array.isArray(leaderData?.data?.results) ? leaderData.data.results
    : Array.isArray(leaderData?.data) ? leaderData.data : []
  const achievements = Array.isArray(achieveData?.data?.results) ? achieveData.data.results
    : Array.isArray(achieveData?.data) ? achieveData.data : []

  const handleCreate = async () => {
    setSaving(true)
    try {
      await createTarget({ ...form, target_amount: parseFloat(form.target_amount), cashier: form.cashier || undefined })
      toast.success('Target created')
      qc.invalidateQueries({ queryKey: ['targets'] })
      setModal(false)
      setForm({ cashier: '', period_type: 'monthly', target_amount: '', start_date: '', end_date: '' })
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed to create target') }
    finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Targets & Leaderboard</h1>
        <button type="button" className="btn-primary" onClick={() => setModal(true)}><Plus size={15} />Set Target</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-accent" />
            <p className="font-semibold text-gray-900">Active Targets</p>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Cashier</th><th className="th">Target</th><th className="th">Period</th></tr></thead>
            <tbody>
              {targets.map((t: any) => (
                <tr key={t.id} className="tr">
                  <td className="td font-medium">{t.cashier_name || t.cashier}</td>
                  <td className="td">GHS {parseFloat(t.target_amount || 0).toFixed(2)}</td>
                  <td className="td capitalize">{t.period}</td>
                </tr>
              ))}
              {targets.length === 0 && <tr><td colSpan={3} className="td text-center text-gray-400 py-6">No targets set</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-amber-500" />
            <p className="font-semibold text-gray-900">Leaderboard</p>
          </div>
          <div className="space-y-3">
            {leaders.map((l: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{l.cashier_name || l.full_name}</p>
                  <p className="text-xs text-gray-400">GHS {parseFloat(l.total_sales || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
            {leaders.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No leaderboard data</p>}
          </div>
        </div>
        {achievements.length > 0 && (
          <div className="card col-span-full">
            <p className="font-semibold text-gray-900 mb-4">My Achievements</p>
            <div className="flex flex-wrap gap-3">
              {achievements.map((a: any) => (
                <div key={a.id} className="flex items-center gap-2 px-4 py-2 bg-accent-light rounded-xl">
                  <Trophy size={14} className="text-accent" />
                  <span className="text-sm font-medium text-accent">{a.title || a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Set Sales Target" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Period</label>
            <select className="input" value={form.period_type} onChange={e => setForm(f => ({ ...f, period_type: e.target.value }))}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          {[
            { label: 'Target Amount (GHS)', key: 'target_amount', type: 'number' },
            { label: 'Start Date', key: 'start_date', type: 'date' },
            { label: 'End Date', key: 'end_date', type: 'date' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Saving…' : 'Create Target'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
