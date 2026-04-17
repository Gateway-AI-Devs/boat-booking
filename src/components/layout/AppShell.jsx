import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import logo from '../../assets/Logo-oneway-ibiza-main.png'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 lg:ml-[240px]">
        {/* Mobile top bar */}
        <div
          className="sticky top-0 z-10 flex h-[60px] items-center gap-3 px-4 lg:hidden"
          style={{ background: '#fff', borderBottom: '1px solid #ede8e0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center rounded-xl p-2"
            style={{ color: '#555', background: '#f4f4f2' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <img src={logo} alt="Logo" className="h-8 object-contain" />
        </div>

        <div className="max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
