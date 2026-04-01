export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '2px solid rgba(124,58,237,0.2)',
        borderTopColor: '#7C3AED',
        borderRadius: '50%',
      }}
      className="animate-spin"
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] gap-3">
      <div
        style={{
          width: 36,
          height: 36,
          border: '2.5px solid rgba(124,58,237,0.15)',
          borderTopColor: '#7C3AED',
          borderRadius: '50%',
        }}
        className="animate-spin"
      />
      <p className="text-xs text-slate-600 font-medium">Loading…</p>
    </div>
  )
}
