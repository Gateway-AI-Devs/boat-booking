import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const ROLE_LABELS = {
  'puravida-captain': 'PuraVida Captain',
  'fantasea-captain': 'FantaSea Captain',
  'admin':            'Admin',
}

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, created_at')
      .eq('id', userId)
      .single()
    if (error) console.error('Failed to load profile:', error.message)
    setProfile(data ?? null)
  }, [])

  // Exposed so any component can force a profile re-fetch (e.g. after avatar upload)
  const refreshProfile = useCallback(async () => {
    const { data: { session: current } } = await supabase.auth.getSession()
    if (current?.user?.id) await fetchProfile(current.user.id)
  }, [fetchProfile])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  const role      = profile?.role ?? null
  const roleLabel = ROLE_LABELS[role] ?? null

  return (
    <AuthContext.Provider value={{
      session, profile, role, roleLabel,
      loading, signIn, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
