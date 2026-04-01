import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Building2, ArrowRightLeft } from 'lucide-react'
import { getBranches, createBranch, getBranchInventory, getTransfers, createTransfer, approveTransfer } from '../api/branches'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Branches() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'branches' | 'transfers'>('branches')
  const [modal, setModal] = useState(false)
  const [invModal, setInvModal] = useState(false)
  const [transferModal, setTransferModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', address: '', phone: '' })
  const [transferForm, setTransferForm] = useState({ from_branch: '', to_branch: '', product: '', quantity: '' })
  const [saving, setSaving] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['branches'], queryFn: getBranches })
  const { data: transferData } = useQuery({ queryKey: ['transfers'], queryFn: getTransfers })
  const { data: invData } = useQuery({
    queryKey: ['branch-inv', selectedBranch],
    queryFn: () => getBranchInventory(selectedBranch!),
    enabled: !!selectedBranch,
  })

  const branches = data?.data?.results || data?.data || []
  const transfers = transferData?.data?.results || transferData?.data || []
  const branchInv = invData?.data?.results || invData?.data || []

  const handleCreate = async () => {
    setSaving(true)
    try {
      await createBranch(form)
      toast.success('Branch created')
      qc.invalidateQueries({ queryKey: ['branches'] })
      setModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleTransfer = async () => {
    setSaving(true)
    try {
      await createTransfer({ ...transferForm, from_branch: Number(transferForm.from_branch), to_branch: Number(transferForm.to_branch), product: Number(transferForm.product), quantity: Number(transferForm.quantity) })
      toast.success('Transfer requested')
      qc.invalidateQueries({ queryKey: ['transfers'] })
      setTransferModal(false)
    } catch (err: any) { toast.error(JSON.stringify(err?.response?.data || 'Error')) }
    finally { setSaving(false) }
  }

  const handleApprove = async (id: number, action: 'approve' | 'reject') => {
    try {
      await approveTransfer(id, action)
      toast.success(`Transfer ${action}d`)
      qc.invalidateQueries({ queryKey: ['transfers'] })
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Error') }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Branches</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setTransferModal(true)}><ArrowRightLeft size={15} />New Transfer</button>
          <button type="button" className="btn-primary" onClick={() => setModal(true)}><Plus size={15} />Add Branch</button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {(['branches', 'transfers'] as const).map(t => (
          <button type="button" key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-accent text-white' : 'text-gray-500'}`}>
            {t === 'transfers' ? `Transfers (${transfers.length})` : 'Branches'}
          </button>
        ))}
      </div>

      {tab === 'branches' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((b: any) => (
            <div key={b.id} className="card cursor-pointer hover:border-accent/30 hover:shadow-md transition-all" onClick={() => { setSelectedBranch(b.id); setInvModal(true) }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center text-accent shrink-0"><Building2 size={18} /></div>
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.address}</p>
                  <p className="text-xs text-gray-400">{b.phone}</p>
                </div>
              </div>
              <p className="text-xs text-accent mt-3">Click to view inventory →</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'transfers' && (
        <div className="card">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">From</th><th className="th">To</th><th className="th">Product</th><th className="th">Qty</th><th className="th">Status</th><th className="th"></th></tr></thead>
            <tbody>
              {transfers.map((t: any) => (
                <tr key={t.id} className="tr">
                  <td className="td">{t.from_branch_name || t.from_branch}</td>
                  <td className="td">{t.to_branch_name || t.to_branch}</td>
                  <td className="td">{t.product_name || t.product}</td>
                  <td className="td">{t.quantity}</td>
                  <td className="td"><span className={`badge-${t.status === 'approved' ? 'green' : t.status === 'rejected' ? 'red' : 'yellow'}`}>{t.status}</span></td>
                  <td className="td">
                    {t.status === 'pending' && (
                      <div className="flex gap-2">
                        <button type="button" className="btn-secondary text-xs py-1 px-2" onClick={() => handleApprove(t.id, 'approve')}>Approve</button>
                        <button type="button" className="btn-danger text-xs py-1 px-2" onClick={() => handleApprove(t.id, 'reject')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && <tr><td colSpan={6} className="td text-center text-gray-400 py-8">No transfers</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New Branch" size="sm">
        <div className="space-y-4">
          {[{ label: 'Branch Name', key: 'name' }, { label: 'Address', key: 'address' }, { label: 'Phone', key: 'phone' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={transferModal} onClose={() => setTransferModal(false)} title="Request Stock Transfer" size="sm">
        <div className="space-y-4">
          {[{ label: 'From Branch ID', key: 'from_branch' }, { label: 'To Branch ID', key: 'to_branch' }, { label: 'Product ID', key: 'product' }, { label: 'Quantity', key: 'quantity' }].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input className="input" type="number" value={(transferForm as any)[key]} onChange={e => setTransferForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setTransferModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleTransfer} disabled={saving}>{saving ? 'Sending…' : 'Request'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={invModal} onClose={() => setInvModal(false)} title="Branch Inventory" size="lg">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Qty</th><th className="th">Reorder Level</th></tr></thead>
          <tbody>
            {branchInv.map((i: any) => (
              <tr key={i.id} className="tr">
                <td className="td font-medium">{i.product_name || i.product}</td>
                <td className="td">{i.quantity}</td>
                <td className="td">{i.reorder_level}</td>
              </tr>
            ))}
            {branchInv.length === 0 && <tr><td colSpan={3} className="td text-center text-gray-400 py-8">No inventory records</td></tr>}
          </tbody>
        </table>
      </Modal>
    </div>
  )
}
