import { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, Minus, Trash2, User, CreditCard, X, ShoppingBag } from 'lucide-react'
import { getProducts, getCategories, getProductByBarcode } from '../api/products'
import { getCustomers } from '../api/customers'
import { createSale } from '../api/sales'
import { useCartStore } from '../store/cartStore'
import { PageSpinner } from '../components/ui/Spinner'
import ReceiptModal from '../components/ui/ReceiptModal'
import toast from 'react-hot-toast'

export default function POS() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [completedSaleId, setCompletedSaleId] = useState<number | null>(null)
  const [payMethod, setPayMethod] = useState('cash')
  const [tendered, setTendered] = useState('')
  const [processing, setProcessing] = useState(false)

  const { items, addItem, removeItem, updateQty, customer, setCustomer, clear, total, subtotal, discount } = useCartStore()

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, selectedCategory],
    queryFn: () => getProducts({ search, category: selectedCategory || undefined }),
  })
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: customersData } = useQuery({ queryKey: ['customers-list'], queryFn: getCustomers })

  const products = productsData?.data?.results || productsData?.data || []
  const categories = categoriesData?.data?.results || categoriesData?.data || []
  const customerList = customersData?.data?.results || customersData?.data || []

  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName
    const isTypingElsewhere =
      (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') &&
      e.target !== searchInputRef.current
    if (isTypingElsewhere) return
    if (tag === 'BUTTON' || tag === 'A') return
    if (e.ctrlKey || e.altKey || e.metaKey) return
    if (e.key.length === 1 || e.key === 'Enter') {
      searchInputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  const handleCheckout = async () => {
    if (!items.length) { toast.error('Cart is empty'); return }
    setProcessing(true)
    try {
      const res = await createSale({
        customer_id: customer?.customer_id || null,
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        payment_method: payMethod === 'momo' ? 'mobile_money' : payMethod,
      })
      const saleId = res?.data?.sale_id
      toast.success('Sale completed!')
      clear()
      setShowPayModal(false)
      setTendered('')
      if (saleId) {
        setCompletedSaleId(saleId)
        setShowReceiptModal(true)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to process sale')
    } finally {
      setProcessing(false)
    }
  }

  const handleScanKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const value = search.trim()
    if (!value) return
    e.preventDefault()
    try {
      const res = await getProductByBarcode(value)
      const p = res?.data
      if (p) {
        addItem({ product_id: p.product_id, product_name: p.product_name, price: parseFloat(p.price) })
        toast.success(`Added: ${p.product_name}`)
        setSearch('')
      }
    } catch {
      toast.error('No product found for that barcode')
    }
  }

  const change = parseFloat(tendered) - total()

  /* ── Glassmorphism panel style ── */
  const panelStyle = {
    background: 'rgba(13,21,38,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  }

  const cartPanelStyle = {
    background: 'linear-gradient(180deg, #0D1526 0%, #0A0E1A 100%)',
    borderLeft: '1px solid rgba(124,58,237,0.15)',
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#070912' }}>
      {/* LEFT — Product Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="px-5 py-3.5 flex items-center gap-3" style={panelStyle}>
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              ref={searchInputRef}
              className="input pl-10 h-10"
              placeholder="Search or scan barcode…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleScanKeyDown}
              autoFocus
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
              style={
                !selectedCategory
                  ? {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                      border: '1px solid rgba(124,58,237,0.5)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: '#94A3B8',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              All
            </button>
            {categories.map((cat: any) => {
              const isActive = selectedCategory === (cat.category_id || cat.id)
              return (
                <button
                  type="button"
                  key={cat.category_id || cat.id}
                  onClick={() => setSelectedCategory(cat.category_id || cat.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                          color: '#fff',
                          boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                          border: '1px solid rgba(124,58,237,0.5)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          color: '#94A3B8',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                  }
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? <PageSpinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map((p: any) => {
                const inCart = items.find(i => i.product_id === (p.product_id || p.id))
                const initial = p.product_name.charAt(0).toUpperCase()
                return (
                  <button
                    type="button"
                    key={p.product_id || p.id}
                    className="pos-product-card text-left relative"
                    onClick={() => addItem({ product_id: p.product_id || p.id, product_name: p.product_name, price: parseFloat(p.price) })}
                  >
                    {inCart && (
                      <span
                        className="absolute top-2 right-2 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-10"
                        style={{
                          background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                          boxShadow: '0 2px 8px rgba(124,58,237,0.5)',
                        }}
                      >
                        {inCart.quantity}
                      </span>
                    )}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 100%)',
                        border: '1px solid rgba(124,58,237,0.2)',
                      }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                      >
                        {initial}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">{p.product_name}</p>
                    <p className="text-sm font-bold" style={{ color: '#A78BFA' }}>
                      GHS {parseFloat(p.price).toFixed(2)}
                    </p>
                    {p.quantity <= (p.reorder_level || 0) && (
                      <span className="text-[9px] text-amber-400 font-bold mt-1 block uppercase tracking-wide">Low stock</span>
                    )}
                  </button>
                )
              })}
              {products.length === 0 && (
                <div className="col-span-full text-center py-24">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <ShoppingBag size={24} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No products found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Cart */}
      <div className="w-80 xl:w-96 flex flex-col h-full" style={cartPanelStyle}>
        {/* Cart header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <ShoppingBag size={13} className="text-violet-400" />
            </div>
            <p className="font-bold text-white text-sm">Current Order</p>
            {items.length > 0 && (
              <span
                className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
              >
                {items.length}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-slate-500 hover:text-rose-400 font-semibold transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Customer */}
        <button
          type="button"
          onClick={() => setShowCustomerModal(true)}
          className="mx-4 mt-3.5 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: customer ? '1px solid rgba(124,58,237,0.3)' : '1px dashed rgba(255,255,255,0.12)',
            color: customer ? '#A78BFA' : '#64748B',
          }}
        >
          <User size={14} />
          <span className="flex-1 text-left">{customer?.full_name || 'Add customer (optional)'}</span>
          {customer && (
            <X
              size={12}
              className="text-slate-500 hover:text-rose-400"
              onClick={e => { e.stopPropagation(); setCustomer(null) }}
            />
          )}
        </button>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <ShoppingBag size={22} className="opacity-40" />
              </div>
              <p className="text-sm font-medium text-slate-500">Cart is empty</p>
              <p className="text-xs text-slate-600 mt-1">Click products to add them</p>
            </div>
          ) : items.map(item => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.product_name}</p>
                <p className="text-[11px] text-slate-500 font-medium">GHS {item.price.toFixed(2)} ea</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => updateQty(item.product_id, item.quantity - 1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Minus size={10} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => updateQty(item.product_id, item.quantity + 1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Plus size={10} />
                </button>
              </div>
              <p className="text-sm font-bold text-violet-300 w-16 text-right">
                GHS {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                aria-label="Remove item"
                onClick={() => removeItem(item.product_id)}
                className="text-slate-600 hover:text-rose-400 transition-colors ml-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          className="px-5 py-5 space-y-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex justify-between text-sm text-slate-400 font-medium">
            <span>Subtotal</span>
            <span>GHS {subtotal().toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm font-semibold text-emerald-400">
              <span>Discount</span>
              <span>– GHS {discount.toFixed(2)}</span>
            </div>
          )}
          <div
            className="flex justify-between pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-lg font-bold" style={{ color: '#A78BFA' }}>
              GHS {total().toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPayModal(true)}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              boxShadow: items.length > 0 ? '0 6px 24px rgba(124,58,237,0.45)' : 'none',
            }}
          >
            <CreditCard size={16} />
            Charge GHS {total().toFixed(2)}
          </button>
        </div>
      </div>

      {/* ── Payment Modal ──────────────────────────────────────── */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(4,6,16,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setShowPayModal(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, #131D35 0%, #0D1526 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Modal header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h2 className="font-bold text-white">Complete Payment</h2>
              <button
                type="button"
                aria-label="Close payment modal"
                onClick={() => setShowPayModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Total */}
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.08) 100%)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Amount Due</p>
                <p
                  className="text-4xl font-bold tracking-tight"
                  style={{ background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  GHS {total().toFixed(2)}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'momo', 'card'].map(m => {
                    const isActive = payMethod === m
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPayMethod(m)}
                        className="py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200"
                        style={
                          isActive
                            ? {
                                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                                color: '#fff',
                                border: '1px solid rgba(124,58,237,0.5)',
                                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                              }
                            : {
                                background: 'rgba(255,255,255,0.05)',
                                color: '#94A3B8',
                                border: '1px solid rgba(255,255,255,0.09)',
                              }
                        }
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tendered (cash only) */}
              {payMethod === 'cash' && (
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-widest">
                    Amount Tendered
                  </label>
                  <input
                    className="input text-lg font-bold text-center"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={tendered}
                    onChange={e => setTendered(e.target.value)}
                    autoFocus
                  />
                  {tendered && change >= 0 && (
                    <div
                      className="mt-3 p-3 rounded-xl text-center"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <p className="text-xs text-emerald-400 font-medium uppercase tracking-widest mb-0.5">Change</p>
                      <p className="text-lg font-bold text-emerald-400">GHS {change.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={processing || (payMethod === 'cash' && parseFloat(tendered) < total())}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
                }}
              >
                {processing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CreditCard size={15} />
                    Complete Sale
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {showReceiptModal && (
        <ReceiptModal
          saleId={completedSaleId}
          onClose={() => { setShowReceiptModal(false); setCompletedSaleId(null) }}
        />
      )}

      {/* ── Customer selection modal ───────────────────────────── */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(4,6,16,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setShowCustomerModal(false)}
          />
          <div
            className="relative w-full max-w-sm max-h-[70vh] flex flex-col rounded-2xl animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, #131D35 0%, #0D1526 100%)',
              border: '1px solid rgba(124,58,237,0.2)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.7)',
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h2 className="font-bold text-white">Select Customer</h2>
              <button
                type="button"
                aria-label="Close customer selection"
                onClick={() => setShowCustomerModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <X size={15} />
              </button>
            </div>
            <div className="overflow-y-auto">
              <button
                type="button"
                onClick={() => { setCustomer(null); setShowCustomerModal(false) }}
                className="w-full px-5 py-3.5 text-left text-sm text-slate-500 font-medium transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                No customer (walk-in)
              </button>
              {customerList.map((c: any) => (
                <button
                  type="button"
                  key={c.customer_id}
                  onClick={() => { setCustomer({ customer_id: c.customer_id, full_name: c.full_name }); setShowCustomerModal(false) }}
                  className="w-full px-5 py-3.5 text-left transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <p className="text-sm font-semibold text-white">{c.full_name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{c.phone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
