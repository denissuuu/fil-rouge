import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Shield, TrendingUp, Users } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../api/properties'
import type { Property } from '../types'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProperties().then(data => setProperties(data.slice(0, 6))).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez le bien immobilier de vos rêves
          </h1>
          <p className="text-primary-100 text-lg mb-8">
            Y-Plaza — 12 agences à travers la France pour vous accompagner dans vos projets d'achat et de vente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher une ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm outline-none"
            />
            <Link
              to={`/properties${search ? `?city=${encodeURIComponent(search)}` : ''}`}
              className="flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Search size={16} />
              Rechercher
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <Users size={20} />, value: '12', label: 'Agences en France' },
            { icon: <Shield size={20} />, value: '500+', label: 'Biens disponibles' },
            { icon: <TrendingUp size={20} />, value: '98%', label: 'Clients satisfaits' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="flex justify-center text-primary-600 mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest properties */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dernières annonces</h2>
            <p className="text-gray-500 text-sm mt-1">Les biens disponibles les plus récents</p>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-1.5 text-primary-600 font-medium text-sm hover:underline"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Aucune annonce pour le moment.</p>
            <p className="text-sm mt-1">Revenez bientôt !</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-100 py-14 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Vous souhaitez vendre votre bien ?</h2>
        <p className="text-gray-500 mb-6">Contactez l'une de nos 12 agences ou créez un compte pour déposer votre annonce.</p>
        <div className="flex justify-center gap-4">
          <Link to="/agencies" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm">
            Nos agences
          </Link>
          <Link to="/register" className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm">
            Créer un compte
          </Link>
        </div>
      </section>
    </div>
  )
}
