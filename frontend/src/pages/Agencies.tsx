import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, ArrowRight } from 'lucide-react'
import { getAgencies } from '../api/agencies'
import type { Agency } from '../types'

export default function Agencies() {
  const [agencies, setAgencies] = useState<Agency[]>([])

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => {})
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nos agences</h1>
        <p className="text-gray-500 text-sm mt-1">
          Y-Plaza dispose de 12 agences réparties sur tout le territoire français.
        </p>
      </div>

      {agencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <div key={agency.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-primary-600 font-bold">
                {agency.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{agency.name}</h3>
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
        <div className="text-center py-16 text-gray-400">
          <p>Aucune agence enregistrée pour le moment.</p>
        </div>
      )}
    </div>
  )
}
