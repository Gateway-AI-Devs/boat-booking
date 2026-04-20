import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewBookingPage from './pages/NewBookingPage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import EnquiryFormPage from './pages/EnquiryFormPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/"            element={<DashboardPage />} />
              <Route path="/new-booking" element={<NewBookingPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
              <Route path="/enquiries/club-tickets"   element={<EnquiryFormPage />} />
              <Route path="/enquiries/villas-hotel"   element={<EnquiryFormPage />} />
              <Route path="/enquiries/island-transfer" element={<EnquiryFormPage />} />
              <Route path="/enquiries/car-hire"       element={<EnquiryFormPage />} />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
