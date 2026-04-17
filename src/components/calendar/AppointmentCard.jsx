const STATUS = {
  confirmed: { bg: '#f0faf1', color: '#1e7e34', dot: '#22c55e', label: 'Confirmed' },
  cancelled:  { bg: '#fff1f2', color: '#be123c', dot: '#f43f5e', label: 'Cancelled'  },
  pending:    { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b', label: 'Pending'    },
  showed:     { bg: '#f0faf1', color: '#1e7e34', dot: '#22c55e', label: 'Showed'     },
  'no-show':  { bg: '#fff1f2', color: '#be123c', dot: '#f43f5e', label: 'No-show'   },
}

export default function AppointmentCard({ appt }) {
  const dt     = new Date(appt.startTime ?? appt.start ?? appt.appointmentTime)
  const endDt  = new Date(appt.endTime   ?? appt.end   ?? dt.getTime() + 3600000)
  const day    = dt.getDate()
  const month  = dt.toLocaleString('en', { month: 'short' }).toUpperCase()
  const dow    = dt.toLocaleString('en', { weekday: 'short' }).toUpperCase()
  const time   = dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  const endTime = endDt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  const title   = appt.title ?? appt.name ?? appt.eventTitle ?? 'Booking'
  const contact = appt.contact?.name ?? appt.contact?.firstName ?? appt.contactName ?? ''
  const status  = (appt.appointmentStatus ?? appt.status ?? 'confirmed').toLowerCase()
  const s       = STATUS[status] ?? STATUS.pending

  return (
    <div
      className="group relative flex items-center gap-5 rounded-2xl border bg-white px-5 py-4 cursor-default"
      style={{
        borderColor: '#ede8e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(160,125,46,0.10), 0 2px 6px rgba(0,0,0,0.05)'
        e.currentTarget.style.borderColor = '#d4b96a'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)'
        e.currentTarget.style.borderColor = '#ede8e0'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Gold left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ background: 'linear-gradient(180deg, #c9a24a, #a07d2e)', opacity: 0.5, transition: 'opacity 0.2s' }}
        ref={(el) => {
          if (el) {
            el.closest('.group').addEventListener('mouseenter', () => { el.style.opacity = '1' })
            el.closest('.group').addEventListener('mouseleave', () => { el.style.opacity = '0.5' })
          }
        }}
      />

      {/* Date block */}
      <div
        className="flex shrink-0 flex-col items-center rounded-xl px-3.5 py-3 min-w-[56px] text-center"
        style={{ background: 'linear-gradient(135deg, #faf8f4 0%, #f4f0e8 100%)', border: '1px solid #ede8e0' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#a07d2e' }}>{month}</span>
        <span className="text-[26px] font-semibold leading-none my-0.5" style={{ color: '#1c1c1a', fontFamily: "'DM Sans', sans-serif" }}>{day}</span>
        <span className="text-[10px] font-medium tracking-wide" style={{ color: '#aaa' }}>{dow}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold truncate" style={{ color: '#1c1c1a', letterSpacing: '-0.01em' }}>
          {title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 text-[12.5px]" style={{ color: '#888' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {time} – {endTime}
          </span>
          {contact && (
            <span className="flex items-center gap-1.5 text-[12.5px]" style={{ color: '#888' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {contact}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: s.bg }}>
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: s.color }}>
          {s.label}
        </span>
      </div>
    </div>
  )
}
