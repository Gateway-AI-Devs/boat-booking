import { useEffect } from 'react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-2xl px-5 py-3.5 text-[13.5px] font-medium"
      style={{
        background: '#111',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        pointerEvents: message ? 'auto' : 'none',
        opacity: message ? 1 : 0,
        transform: message ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.22s, transform 0.22s',
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: '#22c55e' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      {message}
    </div>
  )
}
