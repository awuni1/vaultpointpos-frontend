import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore(s => s.setAuth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(username, password)
      setAuth(data.user, data.access, data.refresh)
      navigate(data.user?.role === 'cashier' ? '/pos' : '/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '48px 24px 28px',
        fontFamily: 'Inter, system-ui, sans-serif',
        /* light dot-grid background — same as landing page */
        background: '#F5F7FA',
        backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── Card ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div
          style={{
            width: '100%', maxWidth: 400,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(27,38,59,0.10)',
            padding: '44px 40px 36px',
          }}
        >

          {/* ── Logo ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: '#1B263B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                boxShadow: '0 4px 16px rgba(27,38,59,0.25)',
              }}
            >
              {/* Vault SVG icon */}
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="3" y="4" width="20" height="18" rx="3.5" stroke="white" strokeWidth="1.6"/>
                <circle cx="13" cy="13" r="4" stroke="white" strokeWidth="1.6"/>
                <circle cx="13" cy="13" r="1.8" fill="white"/>
                <line x1="13" y1="9" x2="13" y2="6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="17" y1="13" x2="19.5" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <line x1="3" y1="8.5" x2="23" y2="8.5" stroke="white" strokeWidth="1" strokeOpacity="0.25"/>
                <circle cx="20.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.4)"/>
              </svg>
            </div>
            <p
              style={{
                fontFamily: 'Manrope, Inter, sans-serif',
                fontWeight: 800, fontSize: 14,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#1B263B', margin: 0,
              }}
            >
              VaultPoint POS
            </p>
            <p
              style={{
                fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#94A3B8', margin: '5px 0 0',
              }}
            >
              Enterprise Transactional Gateway
            </p>
          </div>

          {/* ── Headings ─────────────────────────────────── */}
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontFamily: 'Manrope, Inter, sans-serif',
                fontSize: 20, fontWeight: 700,
                color: '#1B263B', margin: '0 0 5px',
              }}
            >
              Sign In
            </h1>
            <p style={{ fontSize: 12, color: '#778DA9', margin: 0 }}>
              Authenticate to access the retail terminal.
            </p>
          </div>

          {/* ── Form ─────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <AtSign size={13} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  required autoFocus
                  style={inputLight}
                  onFocus={e => { e.target.style.borderColor = '#1B263B'; e.target.style.background = '#fff' }}
                  onBlur={e =>  { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC' }}
                />
              </div>
            </div>

            {/* Vault Key */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={labelStyle}>Vault Key</label>
                <button type="button" style={{ fontSize: 10, fontWeight: 600, color: '#415A77', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={13} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{ ...inputLight, paddingRight: 38 }}
                  onFocus={e => { e.target.style.borderColor = '#1B263B'; e.target.style.background = '#fff' }}
                  onBlur={e =>  { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#415A77' : '#1B263B',
                border: 'none', borderRadius: 10,
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#FFFFFF', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s',
                boxShadow: '0 4px 14px rgba(27,38,59,0.25)',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#0077B6' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#1B263B' }}
            >
              {loading ? (
                <>
                  <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Authenticating…
                </>
              ) : 'Initialize Session →'}
            </button>
          </form>

          {/* Or Register */}
          <p style={{ textAlign: 'center', fontSize: 10, color: '#CBD5E1', margin: '14px 0' }}>
            Or Register
          </p>

          {/* Create account link */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                fontSize: 11, fontWeight: 600, color: '#415A77',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1B263B'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#415A77'}
            >
              Create New Terminal Account →
            </button>
          </div>

          {/* Encrypted by */}
          <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 18, borderTop: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#CBD5E1', margin: 0 }}>
              🔒 Encrypted by Sentinel Vault Systems
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer links ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Privacy Policy', 'Terms of Service', 'Security Architecture', 'Support'].map(l => (
          <button
            key={l}
            type="button"
            style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#415A77'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
          >
            {l}
          </button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ── shared styles ─────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color: '#778DA9', marginBottom: 7,
}

const inputLight: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px 10px 32px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: 9, fontSize: 12,
  color: '#1B263B', outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.15s, background 0.15s',
}
