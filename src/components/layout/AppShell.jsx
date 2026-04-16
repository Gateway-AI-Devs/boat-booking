import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <main className="ml-56 flex-1 px-8 py-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  )
}
