import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppointmentList from '../components/calendar/AppointmentList'
import { BRAND_TABS, CAPTAIN_CALENDAR } from '../constants/brands'

export default function DashboardPage() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState('all')

  if (role === 'admin') {
    const tab = BRAND_TABS.find((t) => t.id === activeTab)
    return (
      <div>
        <div className="mb-6 flex gap-1 border-b border-brand-muted overflow-x-auto">
          {BRAND_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === t.id
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-[#888] hover:text-brand-text'
                }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <AppointmentList
          calendarIds={tab.calendarIds}
          calendarId={tab.calendarId}
          title={`${tab.label} Bookings`}
        />
      </div>
    )
  }

  const captain = CAPTAIN_CALENDAR[role]
  return <AppointmentList calendarId={captain?.calendarId} title={captain?.title} />
}
