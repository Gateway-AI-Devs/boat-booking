const STATUS_STYLES = {
  confirmed: { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled:  { bg: '#fce4ec', color: '#c62828' },
  pending:    { bg: '#fff8e1', color: '#f57f17' },
  showed:     { bg: '#e8f5e9', color: '#2e7d32' },
  'no-show':  { bg: '#fce4ec', color: '#c62828' },
}

export default function AppointmentCard({ appt }) {
  const dt      = new Date(appt.startTime ?? appt.start ?? appt.appointmentTime)
  const endDt   = new Date(appt.endTime   ?? appt.end   ?? dt.getTime() + 3600000)
  const day     = dt.getDate()
  const month   = dt.toLocaleString('en', { month: 'short' }).toUpperCase()
  const time    = dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  const endTime = endDt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  const title   = appt.title ?? appt.name ?? appt.eventTitle ?? 'Booking'
  const contact = appt.contact?.name ?? appt.contact?.firstName ?? appt.contactName ?? ''
  const status  = (appt.appointmentStatus ?? appt.status ?? 'confirmed').toLowerCase()
  const style   = STATUS_STYLES[status] ?? STATUS_STYLES.pending
  const label   = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-[#e2ddd5] bg-white px-5 py-4 transition-colors hover:border-brand-gold">

      {/* Date block */}
      <div className="flex min-w-[52px] flex-col items-center rounded-lg bg-brand-bg px-3 py-2.5">
        <span className="text-2xl font-medium leading-none text-brand-text">{day}</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-brand-gold">{month}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-[15px] font-medium text-brand-text">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#888]">
          <span className="flex items-center gap-1">🕐 {time} – {endTime}</span>
          {contact && <span className="flex items-center gap-1">👤 {contact}</span>}
        </div>
      </div>

      {/* Status badge */}
      <span
        className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
        style={{ background: style.bg, color: style.color }}
      >
        {label}
      </span>
    </div>
  )
}
