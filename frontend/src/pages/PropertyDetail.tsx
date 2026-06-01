import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Maximize2, Euro, Building2, User, ArrowLeft, Calendar } from 'lucide-react'
import { getProperty } from '../api/properties'
import type { Property } from '../types'

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  COMMERCIAL: 'Local commercial',
  LAND: 'Terrain',
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  PENDING: 'Sous offre',
  SOLD: 'Vendu',
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    getProperty(Number(id)).then(setProperty).catch(() => setError(true))
  }, [id])

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">
      <p>Ce bien n'existe pas ou a été supprimé.</p>
      <Link to="/properties" className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:underline text-sm">
        <ArrowLeft size={14} /> Retour aux annonces
      </Link>
    </div>
  )

  if (!property) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-300">
      Chargement…
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Retour aux annonces
      </Link>

      {/* Header image placeholder */}
      <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl h-64 flex items-center justify-center mb-6">
        <span className="text-7xl">🏠</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                {TYPE_LABELS[property.type] ?? property.type}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                property.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {STATUS_LABELS[property.status] ?? property.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-1 text-gray-500 mt-2">
              <MapPin size={15} />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>

          {property.description && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Caractéristiques</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <Maximize2 size={16} className="text-primary-500" />
                <div>
                  <div className="text-xs text-gray-500">Surface</div>
                  <div className="font-medium text-gray-900">{property.surface} m²</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" />
                <div>
                  <div className="text-xs text-gray-500">Publié le</div>
                  <div className="font-medium text-gray-900">
                    {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-primary-600 mb-4">
              <Euro size={20} />
              {property.price.toLocaleString('fr-FR')}
            </div>
            <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm">
              Prendre contact
            </button>
            <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:border-primary-400 transition-colors text-sm mt-2">
              Planifier une visite
            </button>
          </div>

          {(property.agentName || property.agencyName) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Contact</h3>
              {property.agentName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User size={14} className="text-gray-400" />
                  {property.agentName}
                </div>
              )}
              {property.agencyName && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={14} className="text-gray-400" />
                  {property.agencyName}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
