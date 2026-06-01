import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import PropertyCardSkeleton from '../components/PropertyCardSkeleton'
import { getProperties, filterProperties } from '../api/properties'
import type { Property, PropertyType, PropertyFilters } from '../types'

const TYPES: { value: PropertyType; label: string }[] = [
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'COMMERCIAL', label: 'Local commercial' },
  { value: 'LAND', label: 'Terrain' },
]

type SortKey = 'date_desc' | 'price_asc' | 'price_desc' | 'surface_desc'
const SORTS: { value: SortKey; label: string }[] = [
  { value: 'date_desc',    label: 'Plus récents' },
  { value: 'price_asc',   label: 'Prix croissant' },
  { value: 'price_desc',  label: 'Prix décroissant' },
  { value: 'surface_desc',label: 'Surface décroissante' },
]

const PAGE_SIZE = 9

function sortProperties(list: Property[], sort: SortKey): Property[] {
  return [...list].sort((a, b) => {
    if (sort === 'price_asc')    return a.price - b.price
    if (sort === 'price_desc')   return b.price - a.price
    if (sort === 'surface_desc') return b.surface - a.surface
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export default function Properties() {
  const [searchParams] = useSearchParams()
  const [all, setAll] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PropertyFilters>({ city: searchParams.get('city') ?? '' })
  const [sort, setSort] = useState<SortKey>('date_desc')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProperties().then(setAll).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [filters, sort])

  const filtered  = useMemo(() => filterProperties(all, filters), [all, filters])
  const sorted    = useMemo(() => sortProperties(filtered, sort), [filtered, sort])
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => setFilters({})

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annonces immobilières</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? 'Chargement...' : `${filtered.length} bien${filtered.length !== 1 ? 's' : ''} trouvé${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <ArrowUpDown size={13} className="text-gray-400" />
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
              className="outline-none bg-transparent text-gray-700 text-sm cursor-pointer">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {/* Filters toggle */}
          <button onClick={() => setOpen(o => !o)}
            className={`flex items-center gap-2 border px-3 py-2 rounded-lg text-sm font-medium transition-colors ${open ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-400'}`}>
            <SlidersHorizontal size={14} />
            Filtres
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {open && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ville</label>
              <input type="text" placeholder="Ex: Paris" value={filters.city ?? ''}
                onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={filters.type ?? ''}
                onChange={e => setFilters(f => ({ ...f, type: (e.target.value as PropertyType) || undefined }))}
                className={inputClass}>
                <option value="">Tous les types</option>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prix max (€)</label>
              <input type="number" placeholder="Ex: 300000" value={filters.maxPrice ?? ''}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Surface min (m²)</label>
              <input type="number" placeholder="Ex: 50" value={filters.minSurface ?? ''}
                onChange={e => setFilters(f => ({ ...f, minSurface: e.target.value ? Number(e.target.value) : undefined }))}
                className={inputClass} />
            </div>
          </div>
          <button onClick={clearFilters} className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <X size={12} /> Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-500 font-medium">Aucun bien ne correspond à vos critères.</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-primary-600 hover:underline">
            Effacer les filtres
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                n === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:border-primary-400 text-gray-600'
              }`}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
