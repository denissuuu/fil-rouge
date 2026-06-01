import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PlusCircle, Home, Building2, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getProperties, deleteProperty, updateProperty } from '../api/properties'
import Modal from '../components/Modal'
import PropertyForm from '../components/PropertyForm'
import type { Property, PropertyStatus } from '../types'

const STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: 'Disponible',
  PENDING: 'Sous offre',
  SOLD: 'Vendu',
}

const NEXT_STATUS: Record<PropertyStatus, PropertyStatus> = {
  AVAILABLE: 'PENDING',
  PENDING: 'SOLD',
  SOLD: 'AVAILABLE',
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
      getProperties().then(setProperties).catch(() => {})
    }
  }, [user])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const handleCreated = (p: Property) => {
    setProperties(prev => [p, ...prev])
    setShowForm(false)
    toast.success('Annonce publiée avec succès !')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette annonce ?')) return
    try {
      await deleteProperty(id)
      setProperties(prev => prev.filter(p => p.id !== id))
      toast.success('Annonce supprimée.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  const handleStatusChange = async (p: Property) => {
    const next = NEXT_STATUS[p.status]
    try {
      const updated = await updateProperty(p.id, { ...p, status: next })
      setProperties(prev => prev.map(x => x.id === updated.id ? updated : x))
      toast.success(`Statut mis à jour : ${STATUS_LABELS[next]}`)
    } catch {
      toast.error('Erreur lors de la mise à jour du statut.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.firstName} 👋</h1>
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
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-primary-600 text-white rounded-xl p-4 hover:bg-primary-700 transition-colors"
          >
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Gestion des biens</h2>
            <span className="text-xs text-gray-400">{properties.length} bien{properties.length !== 1 ? 's' : ''}</span>
          </div>
          {properties.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Titre</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ville</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Prix</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
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
                        <button
                          onClick={() => handleStatusChange(p)}
                          title="Cliquer pour changer le statut"
                          className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-75 transition-opacity ${
                            p.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                            p.status === 'PENDING'   ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {STATUS_LABELS[p.status]}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
              <p className="text-sm">Aucun bien publié pour l'instant.</p>
              <button onClick={() => setShowForm(true)} className="mt-2 text-sm text-primary-600 hover:underline">
                Publier votre première annonce
              </button>
            </div>
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

      {showForm && (
        <Modal title="Nouvelle annonce" onClose={() => setShowForm(false)}>
          <PropertyForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  )
}
