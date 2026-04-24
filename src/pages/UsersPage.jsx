import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import Toast from '../components/ui/Toast'
import UserCard from '../components/users/UserCard'
import AddUserPanel from '../components/users/AddUserPanel'
import DeleteConfirmModal from '../components/users/DeleteConfirmModal'

export default function UsersPage() {
  const { profile: currentProfile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, created_at')
      .order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const name = deleteTarget.full_name || deleteTarget.email?.split('@')[0] || 'User'
    const { error } = await supabase.functions.invoke('delete-user', { body: { userId: deleteTarget.id } })
    if (error) {
      setDeleting(false)
      setToast(`Failed to remove ${name}: ${error.message}`)
      return
    }
    setUsers((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteTarget(null)
    setToast(`${name} has been removed`)
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[30px] leading-tight font-normal"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1c1c1a', letterSpacing: '-0.02em' }}
          >
            Team Members
          </h1>
          <p className="mt-1 text-[13.5px]" style={{ color: '#aaa' }}>
            {loading ? 'Loading…' : `${users.length} member${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          onClick={() => setPanelOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)', boxShadow: '0 4px 14px rgba(160,125,46,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(160,125,46,0.45)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(160,125,46,0.3)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Member
        </button>
      </div>

      {/* User cards grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(160,125,46,0.08)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: '#1c1c1a' }}>No team members yet</p>
          <p className="text-sm" style={{ color: '#aaa' }}>Click "Add Member" to create the first account.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              isSelf={u.id === currentProfile?.id}
              onAvatarUpdated={(id, url) =>
                setUsers((prev) => prev.map((x) => x.id === id ? { ...x, avatar_url: url } : x))
              }
              onDeleteRequest={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <AddUserPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdded={loadUsers}
      />

      <DeleteConfirmModal
        user={deleteTarget}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}
