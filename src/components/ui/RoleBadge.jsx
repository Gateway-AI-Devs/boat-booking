import { ROLE_OPTIONS, ROLE_META } from '../../constants/roles'

export default function RoleBadge({ role }) {
  const m     = ROLE_META[role] ?? { bg: '#f4f4f2', color: '#666', dot: '#aaa' }
  const label = ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
      style={{ background: m.bg, color: m.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: m.dot }} />
      {label}
    </span>
  )
}
