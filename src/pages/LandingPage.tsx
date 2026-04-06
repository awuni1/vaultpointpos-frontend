import { useNavigate } from 'react-router-dom'
import {
  Zap, ArrowRight, BarChart3, ShoppingCart,
  ChevronRight, TrendingUp, Shield, Package, Database,
} from 'lucide-react'

const NAV_LINKS = ['Dashboard', 'Terminal', 'Inventory', 'Enterprise', 'History']
const BRANDS = ['LUMINA FOODS', 'APEX GROCERY', 'SENTINEL MART', 'NEXUS RETAIL', 'VANTAGE CO.']

/* ─── Hero dark mockup ─────────────────────────────────────────── */
function HeroMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#0D1829',
        border: '1px solid rgba(0,119,182,0.28)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,119,182,0.08)',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#080E1A' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F43F5E' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
        <span className="ml-3 text-[10px] font-medium tracking-wide" style={{ color: '#415A77' }}>
          VaultPoint · Main Branch · Terminal #4
        </span>
      </div>

      <div className="flex">
        {/* Mini icon sidebar */}
        <div
          className="w-10 shrink-0 flex flex-col items-center pt-4 pb-4 gap-3.5"
          style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: '#080E1A' }}
        >
          {[BarChart3, ShoppingCart, Package, Database].map((Icon, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: i === 0 ? 'rgba(0,119,182,0.22)' : 'transparent',
                color: i === 0 ? '#90CAF9' : '#415A77',
              }}
            >
              <Icon size={13} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              ['TOTAL SALES', '$498.56', '#90CAF9'],
              ['TRANSACTIONS', '14', '#E2E8F0'],
              ['AVG TICKET', '$35.61', '#E2E8F0'],
            ].map(([label, val, col]) => (
              <div
                key={label}
                className="rounded-xl p-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[8px] font-bold tracking-widest mb-1" style={{ color: '#415A77' }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: col, fontFamily: 'Manrope,Inter,sans-serif' }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Product rows */}
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              ['Ultrabook X1 Carbon', 'Main Branch', '83 Units', '$1,299.00'],
              ['Pro Audio Q2 Wireless', 'East Side', '14 Units', '$249.99'],
              ['Titan 15 Pro Max', 'Warehouse', '542 Units', '$1,095.00'],
            ].map(([name, loc, qty, price], i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2 text-[9px]"
                style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <div className="w-5 h-5 rounded-md shrink-0" style={{ background: 'rgba(0,119,182,0.18)' }} />
                <span className="flex-1 min-w-0 truncate" style={{ color: '#CBD5E1' }}>{name}</span>
                <span className="hidden sm:inline w-20 text-right" style={{ color: '#415A77' }}>{loc}</span>
                <span className="w-12 text-right" style={{ color: '#415A77' }}>{qty}</span>
                <span className="w-16 text-right font-semibold" style={{ color: '#90CAF9' }}>{price}</span>
              </div>
            ))}
          </div>

          {/* Total footer bar */}
          <div
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
            style={{
              background: 'linear-gradient(135deg, rgba(0,119,182,0.16) 0%, rgba(27,38,59,0.2) 100%)',
              border: '1px solid rgba(0,119,182,0.22)',
            }}
          >
            <div>
              <p className="text-[7px] font-bold tracking-widest mb-0.5" style={{ color: '#415A77' }}>TOTAL SALES</p>
              <p className="text-sm font-bold text-white" style={{ fontFamily: 'Manrope,Inter,sans-serif' }}>$2,410,500.00</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] font-bold tracking-widest mb-0.5" style={{ color: '#415A77' }}>PROJECTED</p>
              <p className="text-sm font-bold" style={{ color: '#90CAF9', fontFamily: 'Manrope,Inter,sans-serif' }}>$3,105,250.00</p>
            </div>
            <div
              className="text-[9px] font-bold px-3.5 py-1.5 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg,#0077B6,#005F8E)', boxShadow: '0 2px 8px rgba(0,119,182,0.35)' }}
            >
              Complete Sale
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard mini-preview ───────────────────────────────────── */
function DashboardPreview() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#F0F6FF', border: '1px solid #DBEAFE' }}>
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #DBEAFE', background: 'white' }}>
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#0077B6' }}>Overview · Today</span>
        <span className="text-[8px] font-semibold px-2 py-0.5 rounded" style={{ background: '#DBEAFE', color: '#0077B6' }}>Live</span>
      </div>
      {/* KPI chips */}
      <div className="grid grid-cols-3 gap-1.5 p-2.5">
        {[['Revenue', '$12,482', '#0077B6'], ['Txns', '142', '#1B263B'], ['Avg', '$87.90', '#1B263B']].map(([l, v, c]) => (
          <div key={l} className="rounded-lg p-2 bg-white" style={{ border: '1px solid #E2E8F0' }}>
            <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#778DA9' }}>{l}</p>
            <p className="text-[11px] font-bold" style={{ color: c, fontFamily: 'Manrope,Inter,sans-serif' }}>{v}</p>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="mx-2.5 mb-2.5 rounded-lg bg-white p-2.5" style={{ border: '1px solid #E2E8F0' }}>
        <p className="text-[7px] font-bold tracking-widest uppercase mb-2" style={{ color: '#778DA9' }}>Weekly Revenue</p>
        <div className="flex items-end gap-1 h-12">
          {[38, 62, 45, 78, 55, 68, 50].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all"
              style={{ height: `${h}%`, background: i === 3 ? '#0077B6' : i === 5 ? '#415A77' : '#BDD9F5' }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['M','T','W','T','F','S','S'].map((d,i) => (
            <span key={i} className="flex-1 text-center" style={{ fontSize: 7, color: '#94A3B8' }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Terminal mini-preview ────────────────────────────────────── */
function TerminalPreview() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#080E1A', border: '1px solid rgba(0,119,182,0.18)' }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#415A77' }}>Cashier Terminal</span>
        <span className="text-[8px] font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(0,119,182,0.2)', color: '#90CAF9' }}>Active</span>
      </div>
      <div className="p-2.5">
        {[
          ['Sliced Bread 400g', '$2.40'],
          ['Mineral Water ×3', '$3.60'],
          ['Basmati Rice 5kg', '$8.50'],
          ['Cooking Oil 1L', '$5.20'],
        ].map(([item, price]) => (
          <div
            key={item}
            className="flex justify-between py-1.5 text-[9px]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span style={{ color: '#94A3B8' }}>{item}</span>
            <span className="font-semibold" style={{ color: '#90CAF9' }}>{price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between mt-2.5 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[7px] font-bold tracking-widest mb-0.5" style={{ color: '#415A77' }}>TOTAL</p>
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'Manrope,Inter,sans-serif' }}>$426.50</p>
          </div>
          <div
            className="text-[9px] font-bold px-4 py-1.5 rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg,#0077B6,#005F8E)' }}
          >
            END
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#F8FAFC',
        color: '#1B263B',
        fontFamily: 'Inter,system-ui,sans-serif',
        backgroundImage: 'radial-gradient(circle,#CBD5E1 1px,transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', height: 60,
          background: 'rgba(248,250,252,0.95)',
          borderBottom: '1px solid #E2E8F0',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg,#0077B6,#1B263B)',
              boxShadow: '0 2px 12px rgba(0,119,182,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Manrope,Inter,sans-serif', fontWeight: 700, fontSize: 15, color: '#1B263B' }}>
            VaultPoint
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <button
              key={link}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: '#415A77',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEF2FF'; (e.currentTarget as HTMLElement).style.color = '#1B263B' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '7px 18px', borderRadius: 9,
              border: '1px solid #E2E8F0', background: 'white',
              fontSize: 13, fontWeight: 600, color: '#415A77', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0077B6'; (e.currentTarget as HTMLElement).style.color = '#0077B6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 18px', borderRadius: 9,
              background: '#1B263B', border: 'none',
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(27,38,59,0.28)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0077B6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1B263B' }}
          >
            Get Started <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '110px 60px 100px',
          display: 'flex', alignItems: 'center', gap: 80,
        }}
      >
        {/* Left copy */}
        <div style={{ flex: '0 0 480px', maxWidth: 480 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(0,119,182,0.07)',
              border: '1px solid rgba(0,119,182,0.18)',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#0077B6',
              marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0077B6', display: 'inline-block' }} />
            Enterprise Ready
          </div>

          <h1
            style={{
              fontFamily: 'Manrope,Inter,sans-serif',
              fontSize: 54, fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em',
              color: '#1B263B', margin: '0 0 24px',
            }}
          >
            The Sentinel's Vault{' '}
            <span style={{ color: '#0077B6' }}>for Enterprise Retail.</span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#415A77', margin: '0 0 40px' }}>
            The fast, secure, and scalable POS system designed for large supermarket chains.
            Built for high-volume transactions and deep inventory visibility.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 10,
                background: '#1B263B', border: 'none',
                fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(27,38,59,0.22)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0077B6'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,119,182,0.32)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1B263B'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(27,38,59,0.22)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              Request a Demo <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 24px', borderRadius: 10,
                background: 'white', border: '1.5px solid #CBD5E1',
                fontSize: 14, fontWeight: 600, color: '#415A77', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0077B6'; (e.currentTarget as HTMLElement).style.color = '#0077B6' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right — mockup */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <HeroMockup />
        </div>
      </section>

      {/* ── BRANDS ────────────────────────────────────────────── */}
      <section
        style={{
          background: 'rgba(255,255,255,0.7)',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '48px 60px',
        }}
      >
        <p
          style={{
            textAlign: 'center', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#94A3B8', marginBottom: 28,
          }}
        >
          Powering Leading Supermarket Chains
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 64, flexWrap: 'wrap' }}>
          {BRANDS.map(b => (
            <span key={b} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#778DA9' }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 60px 80px' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2
            style={{
              fontFamily: 'Manrope,Inter,sans-serif',
              fontSize: 32, fontWeight: 800,
              color: '#1B263B', margin: '0 0 12px',
            }}
          >
            Monolithic Precision in Every Module
          </h2>
          <div style={{ width: 40, height: 3, borderRadius: 99, background: '#0077B6', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: '#415A77', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
            Every component of VaultPoint is carved for speed and security,
            eliminating friction for both tellers and managers.
          </p>
        </div>

        {/* 2-column feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>

          {/* Manager Dashboard — light card */}
          <div
            style={{
              background: 'white', borderRadius: 20,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 24px rgba(27,38,59,0.07)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '36px 32px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0,119,182,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={15} color="#0077B6" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0077B6' }}>
                  Real-time Manager's Dashboard
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#415A77', lineHeight: 1.7, margin: '0 0 24px' }}>
                Orchestrate your entire floor from a single pane of glass. Monitor sale performance,
                inventory levels, and live transaction flow across multiple locations.
              </p>
            </div>
            <div style={{ padding: '0 24px 32px' }}>
              <DashboardPreview />
            </div>
          </div>

          {/* Cashier Terminal — dark card */}
          <div
            style={{
              background: '#0D1829', borderRadius: 20,
              border: '1px solid rgba(0,119,182,0.18)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '36px 32px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0,119,182,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={15} color="#90CAF9" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#90CAF9' }}>
                  High-speed Cashier Terminal
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#778DA9', lineHeight: 1.7, margin: '0 0 24px' }}>
                Built for zero-latency barcode scanning and rapid payment processing. A monolithic
                numeric keypad designed for muscle-memory speed.
              </p>
            </div>
            <div style={{ padding: '0 24px 32px' }}>
              <TerminalPreview />
            </div>
          </div>
        </div>

        {/* 2 smaller cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {[
            {
              icon: Package, label: 'Enterprise Inventory',
              desc: 'Track and manage stock across regional branches and active warehouse zones. Export detailed reports and set reorder triggers.',
              light: true,
            },
            {
              icon: Database, label: 'Immutable Transaction History',
              desc: 'A fully searchable, tamper-evident log of all past sales with advanced filtering, date range selection, and one-click CSV export.',
              light: false,
            },
          ].map(({ icon: Icon, label, desc, light }) => (
            <div
              key={label}
              style={{
                background: light ? 'white' : '#0D1829',
                borderRadius: 16,
                border: light ? '1px solid #E2E8F0' : '1px solid rgba(0,119,182,0.16)',
                padding: '36px 32px 32px',
                boxShadow: light ? '0 2px 16px rgba(27,38,59,0.06)' : '0 2px 16px rgba(0,0,0,0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: light ? 'rgba(0,119,182,0.1)' : 'rgba(0,119,182,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={light ? '#0077B6' : '#90CAF9'} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: light ? '#0077B6' : '#90CAF9' }}>
                  {label}
                </span>
              </div>
              <p style={{ fontSize: 14, color: light ? '#415A77' : '#778DA9', lineHeight: 1.7, margin: '0 0 24px' }}>
                {desc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[90, 60, 75].map((w, i) => (
                  <div key={i} style={{ height: 7, borderRadius: 99, width: `${w}%`, background: light ? '#E2E8F0' : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────── */}
      <section
        style={{
          background: '#1B263B',
          backgroundImage: 'radial-gradient(circle,rgba(0,119,182,0.12) 1px,transparent 1px)',
          backgroundSize: '24px 24px',
          padding: '100px 60px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#415A77', marginBottom: 24 }}>
            ••••• Trusted by enterprise teams
          </p>
          <blockquote
            style={{
              fontFamily: 'Manrope,Inter,sans-serif',
              fontSize: 20, fontWeight: 600,
              lineHeight: 1.6, color: '#E2E8F0',
              margin: '0 0 28px', fontStyle: 'normal',
            }}
          >
            "Since switching to VaultPoint, our checkout speeds have increased by 46% across 200
            locations. The monolithic architecture is truly unbreakable."
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#0077B6,#415A77)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>JA</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', margin: 0 }}>Jonathan A.</p>
              <p style={{ fontSize: 11, color: '#415A77', margin: 0 }}>CTO, Sentinel Mart Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ background: '#F0F4FF', borderTop: '1px solid #E2E8F0', padding: '100px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Manrope,Inter,sans-serif',
              fontSize: 32, fontWeight: 800, color: '#1B263B', margin: '0 0 14px',
            }}
          >
            Ready to upgrade your retail operations?
          </h2>
          <p style={{ fontSize: 14, color: '#415A77', margin: '0 0 32px', lineHeight: 1.65 }}>
            Join hundreds of enterprise retailers who trust VaultPoint to power their busiest days.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 10,
                background: '#1B263B', border: 'none',
                fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(27,38,59,0.22)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0077B6' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1B263B' }}
            >
              Get Started Today <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '13px 28px', borderRadius: 10,
                background: 'white', border: '1.5px solid #CBD5E1',
                fontSize: 14, fontWeight: 600, color: '#415A77', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0077B6'; (e.currentTarget as HTMLElement).style.color = '#0077B6' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer
        style={{
          background: 'white', borderTop: '1px solid #E2E8F0',
          padding: '28px 60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#0077B6,#1B263B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={11} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Manrope,Inter,sans-serif', fontWeight: 700, fontSize: 13, color: '#1B263B' }}>VaultPoint</span>
          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 6 }}>© 2026 All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={11} /> Enterprise-grade security</span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={11} /> 99.9% uptime SLA</span>
        </div>
      </footer>

    </div>
  )
}
