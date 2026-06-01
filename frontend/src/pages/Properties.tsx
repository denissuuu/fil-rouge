import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../api/properties'
import { filterProperties } from '../api/properties'
import type { Property, PropertyType, PropertyFilters } from '../types'

const TYPES: { value: PropertyType; label: string }[] = [
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'COMMERCIAL', label: 'Local commercial' },
  { value: 'LAND', label: 'Terrain' },
]

export default function Properties() {
  const [searchParams] = useSearchParams()
  const [all, setAll] = useState<Property[]>([])
  const [filters, setFilters] = useState<PropertyFilters>({
    city: searchParams.get('city') ?? '',
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getProperties().then(setAll).catch(() => {})
  }, [])

  const filtered = filterProperties(all, filters)

  const clearFilters = () => setFilters({})

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces immobilières</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} bien{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-primary-400 transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filtres
        </button>
      </div>

      {/* Filters panel */}
      {open && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ville</label>
              <input
                type="text"
                placeholder="Ex: Paris"
                value={filters.city ?? ''}
                onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                value={filters.type ?? ''}
                onChange={e => setFilters(f => ({ ...f, type: (e.target.value as PropertyType) || undefined }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Tous les types</option>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prix max (€)</label>
              <input
                type="number"
                placeholder="Ex: 300000"
                value={filters.maxPrice ?? ''}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Surface min (m²)</label>
              <input
                type="number"
                placeholder="Ex: 50"
                value={filters.minSurface ?? ''}
                onChange={e => setFilters(f => ({ ...f, minSurface: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <button onClick={clearFilters} className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <X size={12} /> Réinitialiser les filtres
          </button>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucun bien ne correspond à vos critères.</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-primary-600 hover:underline">
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  )
}
