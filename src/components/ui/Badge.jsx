const ROLE_COLORS = {
  'puravida-captain': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'fantasea-captain': 'bg-sky-50 text-sky-700 border-sky-200',
  'admin':            'bg-amber-50 text-amber-700 border-amber-200',
}

export default function Badge({ role, label }) {
  const colors = ROLE_COLORS[role] ?? 'bg-brand-muted text-brand-text border-brand-muted'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors}`}>
      {label}
    </span>
  )
}
