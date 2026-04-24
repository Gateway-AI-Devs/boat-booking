import { useState, useEffect } from 'react'

export default function DeleteConfirmModal({ user, onConfirm, onCancel, deleting }) {
  const [typed, setTyped] = useState('')
  const match = typed.trim() === 'DELETE'

  useEffect(() => { if (!user) setTyped('') }, [user])

  if (!user) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[420px] rounded-2xl bg-white p-7"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)', border: '1px solid #ede8e0' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl mb-5" style={{ background: '#fff1f2' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>

          <h2 className="text-[17px] font-semibold mb-1" style={{ color: '#1c1c1a' }}>Remove team member</h2>
          <p className="text-[13.5px] mb-5" style={{ color: '#888' }}>
            This will permanently delete{' '}
            <span className="font-semibold" style={{ color: '#1c1c1a' }}>{user.email}</span>{' '}
            and cannot be undone.
          </p>

          <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
            Type <span style={{ color: '#e11d48', fontWeight: 700 }}>DELETE</span> to confirm
          </label>
          <input
            autoFocus
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && match) onConfirm() }}
            placeholder="DELETE"
            className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 text-[14px] outline-none mb-5"
            style={{ borderColor: typed && match ? '#22c55e' : '#e2ddd5', color: '#1c1c1a' }}
            onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px rgba(225,29,72,0.10)' }}
            onBlur={(e)  => { e.target.style.boxShadow = 'none' }}
          />

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border py-2.5 text-[13.5px] font-medium"
              style={{ borderColor: '#e2ddd5', color: '#666', background: '#fafaf9' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f4f4f2' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fafaf9' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!match || deleting}
              className="flex-1 rounded-xl py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                boxShadow: match ? '0 4px 14px rgba(225,29,72,0.3)' : 'none',
              }}
            >
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
