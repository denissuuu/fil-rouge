import { useState, useEffect, type FormEvent } from 'react'
import { createProperty } from '../api/properties'
import { getAgencies } from '../api/agencies'
import type { Agency, Property, PropertyType } from '../types'

interface Props {
  onCreated: (property: Property) => void
  onCancel: () => void
}

const TYPES: { value: PropertyType; label: string }[] = [
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'COMMERCIAL', label: 'Local commercial' },
  { value: 'LAND', label: 'Terrain' },
]

export default function PropertyForm({ onCreated, onCancel }: Props) {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [form, setForm] = useState({
    title: '', description: '', price: '', surface: '',
    city: '', address: '', type: '' as PropertyType | '',
    agencyId: '' as string,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => {})
  }, [])

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.type) { setError('Sélectionnez un type de bien.'); return }
    setError('')
    setLoading(true)
    try {
      const property = await createProperty({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        surface: Number(form.surface),
        city: form.city,
        address: form.address,
        type: form.type as PropertyType,
        status: 'AVAILABLE',
        agencyId: form.agencyId ? Number(form.agencyId) : null,
      })
      onCreated(property)
    } catch {
      setError('Erreur lors de la création de l\'annonce.')
    } finally {
      setLoading(false)
    }
  }

  const field = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input type="text" required value={form.title} onChange={set('title')} className={field} placeholder="Ex: Appartement lumineux centre-ville" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={set('description')} rows={3}
          className={field} placeholder="Description du bien..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input type="number" required min="0" value={form.price} onChange={set('price')} className={field} placeholder="Ex: 250000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
          <input type="number" required min="0" step="0.1" value={form.surface} onChange={set('surface')} className={field} placeholder="Ex: 65" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
        <select required value={form.type} onChange={set('type')} className={field}>
          <option value="">Sélectionner...</option>
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input type="text" required value={form.city} onChange={set('city')} className={field} placeholder="Ex: Paris" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input type="text" required value={form.address} onChange={set('address')} className={field} placeholder="Ex: 12 rue Nationale" />
        </div>
      </div>
      {agencies.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agence (optionnel)</label>
          <select value={form.agencyId} onChange={set('agencyId')} className={field}>
            <option value="">Aucune agence</option>
            {agencies.map(a => <option key={a.id} value={a.id}>{a.name} — {a.city}</option>)}
          </select>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60">
          {loading ? 'Publication...' : 'Publier l\'annonce'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  )
}
