import { format } from 'date-fns'

const STATUS_COLORS = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  showed:    'bg-sky-50 text-sky-700 border-sky-200',
  'no-show': 'bg-red-50 text-red-700 border-red-200',
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-0.5">{label}</p>
      <p className="text-sm text-brand-text">{value}</p>
    </div>
  )
}

export default function BookingModal({ event, onClose }) {
  if (!event) return null

  const ev = event.resource ?? {}
  const statusColor = STATUS_COLORS[ev.appointmentStatus] ?? 'bg-brand-muted text-brand-text border-brand-muted'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-brand-muted bg-brand-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-brand-muted p-5">
          <div className="flex-1 pr-4">
            <h2 className="font-bold text-brand-text text-base leading-snug">{event.title}</h2>
            <p className="mt-1 text-xs text-brand-gold font-medium">
              {format(event.start, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-brand-text/50 hover:bg-brand-muted hover:text-brand-text transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-4 p-5">

          {/* Time */}
          <div className="flex items-center gap-2 rounded-lg bg-white/60 border border-brand-muted px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="2" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span className="text-sm font-medium text-brand-text">
              {format(event.start, 'h:mm a')} – {format(event.end, 'h:mm a')}
            </span>
          </div>

          {/* Status */}
          {ev.appointmentStatus && (
            <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor}`}>
              {ev.appointmentStatus}
            </span>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact"  value={ev.contactName ?? ev.title} />
            <Field label="Phone"    value={ev.phone} />
            <Field label="Email"    value={ev.email} />
            <Field label="Service"  value={ev.notes ?? ev.calendarId} />
          </div>
        </div>
      </div>
    </div>
  )
}
