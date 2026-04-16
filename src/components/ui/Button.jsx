export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-gold/40'

  const variants = {
    primary: 'bg-brand-gold text-white hover:bg-brand-gold-dark active:scale-95',
    outline: 'border border-brand-muted bg-brand-bg text-brand-text hover:bg-brand-muted active:scale-95',
    ghost:   'bg-transparent text-brand-text hover:bg-brand-muted active:scale-95',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
