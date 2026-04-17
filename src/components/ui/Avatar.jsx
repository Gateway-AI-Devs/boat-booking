const SIZES = {
  sm:  'h-7 w-7 text-[10px]',
  md:  'h-9 w-9 text-xs',
  lg:  'h-11 w-11 text-sm',
  xl:  'h-14 w-14 text-base',
}

function initials(name, email) {
  if (name && name.trim()) {
    return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  }
  return (email?.[0] ?? '?').toUpperCase()
}

export default function Avatar({ src, name, email, size = 'md', className = '' }) {
  const sz = SIZES[size] ?? SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? email ?? 'avatar'}
        className={`${sz} rounded-full object-cover ring-2 ring-brand-muted ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-semibold select-none ring-2 ring-brand-muted ${className}`}
      style={{ background: 'rgba(160,125,46,0.12)', color: '#a07d2e' }}
    >
      {initials(name, email)}
    </div>
  )
}
