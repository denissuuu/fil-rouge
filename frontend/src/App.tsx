import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Agencies from './pages/Agencies'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"                  element={<Home />} />
                <Route path="/properties"        element={<Properties />} />
                <Route path="/properties/:id"    element={<PropertyDetail />} />
                <Route path="/agencies"          element={<Agencies />} />
                <Route path="/login"             element={<Login />} />
                <Route path="/register"          element={<Register />} />
                <Route path="/dashboard"         element={<Dashboard />} />
                <Route path="/analytics"         element={<Analytics />} />
                <Route path="*"                  element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
