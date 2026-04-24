export default function Section({ title, subtitle, children }) {
  return (
    <div
      className="rounded-2xl bg-white p-7"
      style={{ border: '1px solid #ede8e0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <div className="mb-6" style={{ borderBottom: '1px solid #f2ede6', paddingBottom: '20px' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: '#1c1c1a' }}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px]" style={{ color: '#aaa' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
