import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PlusCircle, Home, Building2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getProperties } from '../api/properties'
import type { Property } from '../types'

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  PENDING: 'Sous offre',
  SOLD: 'Vendu',
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
      getProperties().then(setProperties).catch(() => {})
    }
  }, [user])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Rôle : <span className="font-medium capitalize">{user?.role?.toLowerCase()}</span>
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/properties" className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
          <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><Home size={18} /></div>
          <div>
            <div className="font-medium text-gray-900 text-sm">Annonces</div>
            <div className="text-xs text-gray-400">Parcourir les biens</div>
          </div>
        </Link>
        <Link to="/agencies" className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
          <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><Building2 size={18} /></div>
          <div>
            <div className="font-medium text-gray-900 text-sm">Agences</div>
            <div className="text-xs text-gray-400">Voir nos agences</div>
          </div>
        </Link>
        {(user?.role === 'AGENT' || user?.role === 'ADMIN') && (
          <button className="flex items-center gap-3 bg-primary-600 text-white rounded-xl p-4 hover:bg-primary-700 transition-colors">
            <PlusCircle size={18} />
            <div>
              <div className="font-medium text-sm">Nouvelle annonce</div>
              <div className="text-xs text-primary-200">Publier un bien</div>
            </div>
          </button>
        )}
      </div>

      {/* Properties list for agents/admins */}
      {(user?.role === 'AGENT' || user?.role === 'ADMIN') && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Gestion des biens</h2>
          {properties.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Titre</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ville</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Prix</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link to={`/properties/${p.id}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.city}</td>
                      <td className="px-4 py-3 font-medium text-primary-600">{p.price.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {STATUS_LABELS[p.status] ?? p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Aucun bien publié pour l'instant.</p>
          )}
        </div>
      )}

      {user?.role === 'CLIENT' && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 text-center">
          <p className="text-primary-700 font-medium">Vous êtes connecté en tant que client.</p>
          <p className="text-primary-500 text-sm mt-1">Parcourez nos annonces et contactez nos agents.</p>
          <Link to="/properties" className="mt-4 inline-block bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Voir les annonces
          </Link>
        </div>
      )}
    </div>
  )
}
