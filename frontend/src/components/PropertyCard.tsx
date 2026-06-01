import { Link } from 'react-router-dom'
import { MapPin, Maximize2 } from 'lucide-react'
import type { Property } from '../types'

const TYPE_CONFIG: Record<string, { label: string; emoji: string; bg: string; accent: string }> = {
  APARTMENT: { label: 'Appartement', emoji: '🏢', bg: 'from-indigo-100 to-blue-50',   accent: 'text-indigo-600 bg-indigo-50' },
  HOUSE:     { label: 'Maison',       emoji: '🏡', bg: 'from-emerald-100 to-teal-50', accent: 'text-emerald-700 bg-emerald-50' },
  COMMERCIAL:{ label: 'Commercial',   emoji: '🏬', bg: 'from-orange-100 to-amber-50', accent: 'text-orange-700 bg-orange-50' },
  LAND:      { label: 'Terrain',      emoji: '🌿', bg: 'from-lime-100 to-green-50',   accent: 'text-lime-700 bg-lime-50' },
}

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  AVAILABLE: { label: 'Disponible', style: 'bg-green-100 text-green-700' },
  PENDING:   { label: 'Sous offre', style: 'bg-amber-100 text-amber-700' },
  SOLD:      { label: 'Vendu',      style: 'bg-red-100 text-red-600' },
}

export default function PropertyCard({ property }: { property: Property }) {
  const type = TYPE_CONFIG[property.type] ?? TYPE_CONFIG.APARTMENT
  const status = STATUS_CONFIG[property.status] ?? STATUS_CONFIG.AVAILABLE

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image placeholder */}
      <div className={`bg-gradient-to-br ${type.bg} h-44 flex flex-col items-center justify-center gap-1 relative`}>
        <span className="text-5xl">{type.emoji}</span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${status.style}`}>
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${type.accent}`}>
          {type.label}
        </span>

        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 text-[15px]">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
          <MapPin size={11} />
          {property.city}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Maximize2 size={11} />
            {property.surface} m²
          </div>
          <div className="font-bold text-gray-900 text-base">
            {property.price.toLocaleString('fr-FR')} <span className="text-primary-600">€</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
