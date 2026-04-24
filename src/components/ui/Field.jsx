export default function Field({ label, children }) {
  return (
    <div>
      <label
        className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2"
        style={{ color: '#999' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
