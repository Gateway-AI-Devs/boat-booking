const STYLES = {
  success: { bg: '#f0faf1', color: '#1e7e34', border: '#bbf7d0' },
  error:   { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
}

export default function FormMessage({ type, message }) {
  if (!message) return null
  const s = STYLES[type]
  return (
    <div
      className="rounded-xl px-4 py-3 text-[13px] font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {message}
    </div>
  )
}
