import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Gift } from 'lucide-react'
import { getVouchers, createVoucher, getGiftCards, createGiftCard } from '../api/vouchers'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Vouchers() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'vouchers' | 'giftcards'>('vouchers')
  const [modal, setModal] = useState(false)
  const [gcModal, setGcModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ code: '', voucher_type: 'percentage', discount_value: '', max_uses: '', minimum_purchase: '', expires_at: '' })
  const [gcForm, setGcForm] = useState({ amount: '', recipient_name: '', recipient_email: '' })

  const { data, isLoading } = useQuery({ queryKey: ['vouchers'], queryFn: getVouchers })
  const { data: gcData } = useQuery({ queryKey: ['gift-cards'], queryFn: getGiftCards })

  const vouchers = data?.data?.results || data?.data || []
  const giftCards = gcData?.data?.results || gcData?.data || []

  const handleCreate = async () => {
    setSaving(true)
    try {
      await createVoucher({ ...form, discount_value: parseFloat(form.discount_value), max_uses: parseInt(form.max_uses), minimum_purchase: parseFloat(form.minimum_purchase) })
      toast.success('Voucher created')
      qc.invalidateQueries({ queryKey: ['vouchers'] })
      setModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleCreateGC = async () => {
    setSaving(true)
    try {
      await createGiftCard({ ...gcForm, amount: parseFloat(gcForm.amount) })
      toast.success('Gift card created')
      qc.invalidateQueries({ queryKey: ['gift-cards'] })
      setGcModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vouchers & Gift Cards</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setGcModal(true)}><Gift size={15} />New Gift Card</button>
          <button type="button" className="btn-primary" onClick={() => setModal(true)}><Plus size={15} />New Voucher</button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {([{ key: 'vouchers', label: `Vouchers (${vouchers.length})` }, { key: 'giftcards', label: `Gift Cards (${giftCards.length})` }] as const).map(t => (
          <button type="button" key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'vouchers' ? (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Code</th><th className="th">Type</th><th className="th">Discount</th><th className="th">Min Purchase</th><th className="th">Uses</th><th className="th">Expires</th><th className="th">Active</th></tr></thead>
            <tbody>
              {vouchers.map((v: any) => (
                <tr key={v.id} className="tr">
                  <td className="td font-mono font-semibold text-accent">{v.code}</td>
                  <td className="td capitalize">{v.voucher_type}</td>
                  <td className="td">{v.voucher_type === 'percentage' ? `${v.discount_value}%` : `GHS ${v.discount_value}`}</td>
                  <td className="td">GHS {v.minimum_purchase}</td>
                  <td className="td">{v.times_used || 0}/{v.max_uses || '∞'}</td>
                  <td className="td text-gray-400">{v.expires_at ? new Date(v.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td className="td"><span className={v.is_active ? 'badge-green' : 'badge-gray'}>{v.is_active ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
              {vouchers.length === 0 && <tr><td colSpan={7} className="td text-center text-gray-400 py-8">No vouchers</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Code</th><th className="th">Recipient</th><th className="th">Balance</th><th className="th">Original</th><th className="th">Status</th></tr></thead>
            <tbody>
              {giftCards.map((gc: any) => (
                <tr key={gc.id} className="tr">
                  <td className="td font-mono font-semibold">{gc.code}</td>
                  <td className="td">{gc.recipient_name || '—'}</td>
                  <td className="td font-semibold">GHS {parseFloat(gc.balance || gc.amount || 0).toFixed(2)}</td>
                  <td className="td text-gray-400">GHS {parseFloat(gc.amount || 0).toFixed(2)}</td>
                  <td className="td"><span className={gc.is_active ? 'badge-green' : 'badge-gray'}>{gc.is_active ? 'Active' : 'Used'}</span></td>
                </tr>
              ))}
              {giftCards.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No gift cards</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Voucher">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Code</label>
            <input className="input font-mono" placeholder="e.g. SAVE10" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
            <select className="input" aria-label="Type" value={form.voucher_type} onChange={e => setForm(f => ({ ...f, voucher_type: e.target.value }))}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          {[{ label: 'Discount Value', key: 'discount_value' }, { label: 'Max Uses', key: 'max_uses' }, { label: 'Minimum Purchase (GHS)', key: 'minimum_purchase' }, { label: 'Expires At', key: 'expires_at', type: 'date' }].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type={type || 'number'} aria-label={label} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={gcModal} onClose={() => setGcModal(false)} title="New Gift Card" size="sm">
        <div className="space-y-4">
          {[{ label: 'Amount (GHS)', key: 'amount', type: 'number' }, { label: 'Recipient Name', key: 'recipient_name' }, { label: 'Recipient Email', key: 'recipient_email' }].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type={type || 'text'} aria-label={label} value={(gcForm as any)[key]} onChange={e => setGcForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setGcModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreateGC} disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
