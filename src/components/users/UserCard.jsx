import { useState, useRef } from 'react'
import Avatar from '../ui/Avatar'
import Spinner from '../ui/Spinner'
import RoleBadge from '../ui/RoleBadge'
import { uploadAvatar } from '../../lib/storage'

export default function UserCard({ user, isSelf, onAvatarUpdated, onDeleteRequest }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(user.avatar_url)

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAvatar(user.id, file)
      setAvatarSrc(url)
      onAvatarUpdated(user.id, url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div
      className="group relative rounded-2xl bg-white p-5 flex flex-col gap-4"
      style={{ border: '1px solid #ede8e0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, border-color 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d4b96a'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(160,125,46,0.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ede8e0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Delete btn */}
      {!isSelf && (
        <button
          onClick={() => onDeleteRequest(user)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 transition-opacity"
          style={{ color: '#ccc', background: '#f9f9f8' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#e11d48'; e.currentTarget.style.background = '#fff1f2' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#f9f9f8' }}
          title="Remove user"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative group/av shrink-0 cursor-pointer"
          title="Change photo"
        >
          <Avatar src={avatarSrc} name={user.full_name} email={user.email} size="lg"
                  className={uploading ? 'opacity-50' : ''} />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 group-hover/av:opacity-100">
            {uploading
              ? <Spinner size="sm" />
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4" fill="white"/>
                </svg>
            }
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: '#1c1c1a' }}>
            {user.full_name || '—'}
            {isSelf && <span className="ml-2 text-[10px] font-normal" style={{ color: '#aaa' }}>you</span>}
          </p>
          <p className="text-[12px] truncate mt-0.5" style={{ color: '#aaa' }}>{user.email}</p>
        </div>
      </div>

      {/* Role + joined */}
      <div className="flex items-center justify-between">
        <RoleBadge role={user.role} />
        <span className="text-[11px]" style={{ color: '#ccc' }}>
          {new Date(user.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  )
}
