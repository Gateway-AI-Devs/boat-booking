import { useState } from 'react'
import AppointmentList from '../components/calendar/AppointmentList'

const TABS = [
  { id: 'puravida', label: 'PuraVida', icon: '🌿' },
  { id: 'fantasea', label: 'FantaSea', icon: '🌊' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('puravida')

  const puravidaId  = import.meta.env.VITE_GHL_PURAVIDA_CALENDAR_ID
  const fantaseasId = import.meta.env.VITE_GHL_FANTASEA_CALENDAR_ID

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-[26px] font-normal text-brand-text">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#888]">All boat bookings across both brands</p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 border-b border-brand-muted">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-[#888] hover:text-brand-text'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'puravida' && (
        <AppointmentList calendarId={puravidaId} title="PuraVida Bookings" />
      )}
      {activeTab === 'fantasea' && (
        <AppointmentList calendarId={fantaseasId} title="FantaSea Bookings" />
      )}
    </div>
  )
}
