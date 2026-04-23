const STATUS = {
  confirmed: { bg: '#f0faf1', color: '#1e7e34', dot: '#22c55e', label: 'Confirmed' },
  cancelled:  { bg: '#fff1f2', color: '#be123c', dot: '#f43f5e', label: 'Cancelled'  },
  pending:    { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b', label: 'Pending'    },
  showed:     { bg: '#f0faf1', color: '#1e7e34', dot: '#22c55e', label: 'Showed'     },
  'no-show':  { bg: '#fff1f2', color: '#be123c', dot: '#f43f5e', label: 'No-show'   },
}

function InfoRow({ icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[12.5px]" style={{ color: '#888' }}>
      {icon}
      {children}
    </span>
  )
}

const ICONS = {
  clock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  guests: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  boat: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 20h20M12 3L4 14h16L12 3z"/>
    </svg>
  ),
  package: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  money: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  note: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
}

export default function AppointmentCard({ appt, showContact = false }) {
  const dt      = new Date(appt.startTime ?? appt.start ?? appt.appointmentTime)
  const endDt   = new Date(appt.endTime   ?? appt.end   ?? dt.getTime() + 3600000)
  const day     = dt.getDate()
  const month   = dt.toLocaleString('en', { month: 'short' }).toUpperCase()
  const dow     = dt.toLocaleString('en', { weekday: 'short' }).toUpperCase()
  const time    = dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  const endTime = endDt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  const title  = appt.title ?? appt.name ?? appt.eventTitle ?? 'Booking'
  const cObj   = appt.contact ?? {}
  const phone  = cObj.phone ?? appt.phone ?? ''
  const email  = cObj.email ?? appt.email ?? ''
  const status = (appt.appointmentStatus ?? appt.status ?? 'confirmed').toLowerCase()
  const s      = STATUS[status] ?? STATUS.pending

  const cd      = appt.customData ?? {}
  const upsells = appt.upsells ?? []

  return (
    <div
      className="group relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 rounded-2xl border bg-white px-4 sm:px-5 py-4 cursor-default"
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
        className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 rounded-xl px-3.5 py-2 sm:py-3 min-w-[56px] sm:text-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #faf8f4 0%, #f4f0e8 100%)', border: '1px solid #ede8e0' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#a07d2e' }}>{month}</span>
        <span className="text-[22px] sm:text-[26px] font-semibold leading-none sm:my-0.5" style={{ color: '#1c1c1a', fontFamily: "'DM Sans', sans-serif" }}>{day}</span>
        <span className="text-[10px] font-medium tracking-wide hidden sm:block" style={{ color: '#aaa' }}>{dow}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold truncate" style={{ color: '#1c1c1a', letterSpacing: '-0.01em' }}>
          {title}
        </p>

        {/* Row 1: time + guests */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {cd.guests != null && (
            <InfoRow icon={ICONS.guests}>
              {cd.guests} guest{cd.guests !== '1' ? 's' : ''}
            </InfoRow>
          )}
          {cd.boat && <InfoRow icon={ICONS.boat}>{cd.boat}</InfoRow>}
          {cd.package && <InfoRow icon={ICONS.package}>{cd.package}</InfoRow>}
          {cd.timeSlot && (
            <InfoRow icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            }>{cd.timeSlot}</InfoRow>
          )}
          {cd.season && (
            <InfoRow icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            }>{cd.season}</InfoRow>
          )}
        </div>

        {/* Row 2: financials */}
        {(cd.depositAmount || cd.totalPackageValue) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {cd.depositAmount && (
              <InfoRow icon={ICONS.money}>Deposit: {cd.depositAmount}</InfoRow>
            )}
            {showContact && cd.totalPackageValue && (
              <InfoRow icon={ICONS.money}>Total: {cd.totalPackageValue}</InfoRow>
            )}
          </div>
        )}

        {/* Row 3: notes */}
        {cd.notes && (
          <div className="mt-1.5">
            <InfoRow icon={ICONS.note}>{cd.notes}</InfoRow>
          </div>
        )}

        {/* Upsells */}
        {upsells.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {upsells.map((label) => (
              <span
                key={label}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ background: 'rgba(160,125,46,0.1)', color: '#a07d2e', border: '1px solid rgba(160,125,46,0.25)' }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Contact details — admin only */}
        {showContact && (phone || email) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1" style={{ borderTop: '1px dashed #f0ebe3', paddingTop: '8px' }}>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 text-[12px]"
                style={{ color: '#a07d2e', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#7a5f22' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a07d2e' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.18 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 text-[12px]"
                style={{ color: '#a07d2e', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#7a5f22' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a07d2e' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {email}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="shrink-0 self-start flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: s.bg }}>
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: s.color }}>
          {s.label}
        </span>
      </div>
    </div>
  )
}
