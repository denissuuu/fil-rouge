import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, ArrowRight, PlusCircle, Trash2 } from 'lucide-react'
import { getAgencies } from '../api/agencies'
import { useAuth } from '../contexts/AuthContext'
import Modal from '../components/Modal'
import AgencyForm from '../components/AgencyForm'
import api from '../api/client'
import type { Agency } from '../types'

export default function Agencies() {
  const { user } = useAuth()
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => {})
  }, [])

  const handleCreated = (agency: Agency) => {
    setAgencies(prev => [...prev, agency])
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette agence ?')) return
    await api.delete(`/agencies/${id}`)
    setAgencies(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nos agences</h1>
          <p className="text-gray-500 text-sm mt-1">
            Y-Plaza dispose de {agencies.length || 12} agences réparties sur tout le territoire français.
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <PlusCircle size={15} />
            Ajouter une agence
          </button>
        )}
      </div>

      {agencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <div key={agency.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                  {agency.name.charAt(0)}
                </div>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(agency.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Supprimer l'agence"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mt-3">{agency.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                <MapPin size={13} />
                {agency.city} — {agency.address}
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                <Users size={13} />
                {agency.agentCount} agent{agency.agentCount !== 1 ? 's' : ''}
              </div>
              <Link
                to={`/properties?agency=${agency.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:underline"
              >
                Voir les annonces <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
          <p>Aucune agence enregistrée pour le moment.</p>
          {user?.role === 'ADMIN' && (
            <button onClick={() => setShowForm(true)} className="mt-2 text-sm text-primary-600 hover:underline">
              Ajouter la première agence
            </button>
          )}
        </div>
      )}

      {showForm && (
        <Modal title="Ajouter une agence" onClose={() => setShowForm(false)}>
          <AgencyForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  )
}
