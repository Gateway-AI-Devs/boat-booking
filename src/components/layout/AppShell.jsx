import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <main className="ml-[240px] flex-1 min-w-0">
        <div className="max-w-3xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
