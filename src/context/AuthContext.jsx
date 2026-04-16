import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const ROLE_LABELS = {
  'puravida-captain': 'PuraVida Captain',
  'fantasea-captain': 'FantaSea Captain',
  'admin': 'Admin',
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('mock_role') || null)

  function signIn(selectedRole) {
    localStorage.setItem('mock_role', selectedRole)
    setRole(selectedRole)
  }

  function signOut() {
    localStorage.removeItem('mock_role')
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, roleLabel: ROLE_LABELS[role] ?? null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
