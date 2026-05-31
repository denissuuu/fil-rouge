import { Link } from 'react-router-dom'
import { MapPin, Maximize2, Euro } from 'lucide-react'
import type { Property } from '../types'

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  COMMERCIAL: 'Local commercial',
  LAND: 'Terrain',
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SOLD: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  PENDING: 'Sous offre',
  SOLD: 'Vendu',
}

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-48 flex items-center justify-center">
        <span className="text-4xl text-primary-300">🏠</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {TYPE_LABELS[property.type] ?? property.type}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLES[property.status]}`}>
            {STATUS_LABELS[property.status] ?? property.status}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin size={13} />
          {property.city}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Maximize2 size={13} />
            {property.surface} m²
          </div>
          <div className="flex items-center gap-1 font-bold text-primary-600">
            <Euro size={14} />
            {property.price.toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    </Link>
  )
}
