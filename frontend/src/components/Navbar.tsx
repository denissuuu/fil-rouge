import { Link, useNavigate } from 'react-router-dom'
import { Building2, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Building2 size={24} />
            Y-Plaza
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/properties" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Annonces
            </Link>
            <Link to="/agencies" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Agences
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User size={16} />
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
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
