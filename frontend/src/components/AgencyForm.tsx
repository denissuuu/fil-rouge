import { useState, type FormEvent } from 'react'
import { createAgency } from '../api/agencies'
import type { Agency } from '../types'

interface Props {
  onCreated: (agency: Agency) => void
  onCancel: () => void
}

export default function AgencyForm({ onCreated, onCancel }: Props) {
  const [form, setForm] = useState({ name: '', city: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const agency = await createAgency(form)
      onCreated(agency)
    } catch {
      setError('Erreur lors de la création de l\'agence.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
        <input
          type="text" required value={form.name} onChange={set('name')}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
          placeholder="Ex: Agence Y-Plaza Marseille"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
        <input
          type="text" required value={form.city} onChange={set('city')}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
          placeholder="Ex: Marseille"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input
          type="text" required value={form.address} onChange={set('address')}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
          placeholder="Ex: 12 rue de la République"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={loading}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Création...' : 'Créer l\'agence'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
