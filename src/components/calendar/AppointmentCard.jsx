import { STATUS } from '../../constants/appointmentStatus'
import { TIMEZONE } from '../../utils/dateUtils'

const GOLD = '#a07d2e'

const ICONS = {
  guests: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  boat: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 20h20M12 3L4 14h16L12 3z"/>
    </svg>
  ),
  package: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  money: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  note: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  phone: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.18 2 2 0 0 1 3.22 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  mail: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
}

function MetaItem({ icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[11.5px] min-w-0" style={{ color: '#888' }}>
      <span className="shrink-0" style={{ color: GOLD }}>{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  )
}

export default function AppointmentCard({ appt, showContact = false }) {
  const dt      = new Date(appt.startTime ?? appt.start ?? appt.appointmentTime)
  const endDt   = new Date(appt.endTime   ?? appt.end   ?? dt.getTime() + 3600000)
  const time    = dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE })
  const endTime = endDt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: TIMEZONE })

  const title  = appt.title ?? appt.name ?? appt.eventTitle ?? 'Booking'
  const cObj   = appt.contact ?? {}
  const phone  = cObj.phone ?? appt.phone ?? ''
  const email  = cObj.email ?? appt.email ?? ''
  const status = (appt.appointmentStatus ?? appt.status ?? 'confirmed').toLowerCase()
  const s      = STATUS[status] ?? STATUS.pending

  const cd      = appt.customData ?? {}
  const upsells = appt.upsells ?? []

  const goldAccent = 'rgba(160,125,46,0.4)'

  return (
    <div
      className="group flex flex-col rounded-xl border bg-[#fefcf9] cursor-default overflow-hidden"
      style={{
        borderColor: '#e8e3db',
        borderLeft: `3px solid ${goldAccent}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow     = '0 8px 24px rgba(160,125,46,0.12), 0 2px 8px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor    = '#d4b96a'
        e.currentTarget.style.borderLeftColor = 'rgba(160,125,46,0.8)'
        e.currentTarget.style.transform     = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow      = '0 1px 3px rgba(0,0,0,0.04)'
        e.currentTarget.style.borderColor     = '#e8e3db'
        e.currentTarget.style.borderLeftColor = goldAccent
        e.currentTarget.style.transform      = 'translateY(0)'
      }}
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Header: time slot + status */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0 text-[11px] font-bold" style={{ color: GOLD }}>{time}</span>
            <span className="shrink-0 text-[9px]" style={{ color: '#ccc' }}>–</span>
            <span className="text-[9px] font-medium truncate" style={{ color: '#bbb' }}>{endTime}</span>
          </div>
          <div className="shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: s.bg }}>
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
            <span className="text-[9px] font-semibold uppercase leading-none" style={{ color: s.color }}>{s.label}</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-[13px] font-semibold leading-snug" style={{ color: '#1c1c1a' }}>
          {title}
        </p>

        {/* Meta items */}
        <div className="flex flex-wrap gap-x-2.5 gap-y-1">
          {cd.boat    && <MetaItem icon={ICONS.boat}>{cd.boat}</MetaItem>}
          {cd.package && <MetaItem icon={ICONS.package}>{cd.package}</MetaItem>}
          {cd.guests != null && (
            <MetaItem icon={ICONS.guests}>{cd.guests} guest{cd.guests !== '1' ? 's' : ''}</MetaItem>
          )}
          {cd.depositAmount && <MetaItem icon={ICONS.money}>{cd.depositAmount}</MetaItem>}
          {showContact && cd.totalPackageValue && <MetaItem icon={ICONS.money}>Total: {cd.totalPackageValue}</MetaItem>}
        </div>

        {/* Notes */}
        {cd.notes && (
          <div className="flex items-start gap-1.5 text-[11.5px]" style={{ color: '#999' }}>
            <span className="shrink-0 mt-0.5" style={{ color: GOLD }}>{ICONS.note}</span>
            <span className="line-clamp-2">{cd.notes}</span>
          </div>
        )}

        {/* Upsells */}
        {upsells.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {upsells.map((label) => (
              <span
                key={label}
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                style={{ background: 'rgba(160,125,46,0.08)', color: '#a07d2e', border: '1px solid rgba(160,125,46,0.2)' }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Contact */}
        {showContact && (phone || email) && (
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 pt-1.5" style={{ borderTop: '1px dashed #ede5d8' }}>
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1 text-[10px]" style={{ color: '#a07d2e', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#7a5f22' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a07d2e' }}
              >
                {ICONS.phone}
                <span className="truncate">{phone}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 text-[10px]" style={{ color: '#a07d2e', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#7a5f22' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a07d2e' }}
              >
                {ICONS.mail}
                <span className="truncate">{email}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
