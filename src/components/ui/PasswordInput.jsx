import { useState } from 'react'

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

export default function PasswordInput({ value, onChange, placeholder, required, className, style, inputStyle, onFocus, onBlur }) {
  const [show, setShow] = useState(false)

  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 pr-11 text-[14px] outline-none"
        style={{ borderColor: '#e2ddd5', color: '#1c1c1a', ...inputStyle }}
        onFocus={(e) => { e.target.style.borderColor = '#a07d2e'; e.target.style.boxShadow = '0 0 0 3px rgba(160,125,46,0.12)'; onFocus?.(e) }}
        onBlur={(e)  => { e.target.style.borderColor = '#e2ddd5'; e.target.style.boxShadow = 'none'; onBlur?.(e) }}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3.5"
        style={{ color: '#bbb', background: 'none', border: 'none', cursor: 'pointer' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#888' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#bbb' }}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  )
}
