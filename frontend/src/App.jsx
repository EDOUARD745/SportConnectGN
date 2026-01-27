import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ScrollToHash from './components/ScrollToHash.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ActivitiesPage from './pages/ActivitiesPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
