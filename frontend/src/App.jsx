import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ActivitiesPage from './pages/ActivitiesPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import DashboardHome from './pages/dashboard/DashboardHome.jsx'
import ProfilePage from './pages/dashboard/ProfilePage.jsx'
import MyMatchesPage from './pages/dashboard/MyMatchesPage.jsx'
import MessagesPage from './pages/dashboard/MessagesPage.jsx'
import { useAuth } from './context/AuthContext.jsx'

function RequireAuth({ children }) {
  const { isBootstrapping, isAuthenticated } = useAuth()
  if (isBootstrapping) {
    return (
      <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Chargement…
          </div>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen app-bg">
        <ScrollToHash />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="matches" element={<MyMatchesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
