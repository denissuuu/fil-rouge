import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Building2, LogOut, LayoutDashboard, BarChart2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive
    ? 'text-primary-600'
    : 'text-gray-500 hover:text-gray-900'}`

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-gray-900">Y-<span className="text-primary-600">Plaza</span></span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/properties" className={linkClass}>Annonces</NavLink>
            <NavLink to="/agencies" className={linkClass}>Agences</NavLink>
            <NavLink to="/analytics" className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`
            }>
              <BarChart2 size={14} />
              Marché
            </NavLink>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
                >
                  <LayoutDashboard size={15} />
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
