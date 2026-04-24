export default function Input({ style, onFocus, onBlur, ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 text-[14px] outline-none"
      style={{ borderColor: '#e2ddd5', color: '#1c1c1a', ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = '#a07d2e'
        e.target.style.boxShadow   = '0 0 0 3px rgba(160,125,46,0.12)'
        onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e2ddd5'
        e.target.style.boxShadow   = 'none'
        onBlur?.(e)
      }}
    />
  )
}
