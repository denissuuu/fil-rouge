import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Shield, TrendingUp, Users, MapPin, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../api/properties'
import type { Property } from '../types'

const CITIES = ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux']

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProperties().then(data => setProperties(data.slice(0, 6))).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">
        <div className="absolute inset-0 bg-grid-pattern" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            12 agences actives en France
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Trouvez le bien<br />
            <span className="text-primary-300">immobilier idéal</span>
          </h1>
          <p className="text-primary-200 text-lg mb-10 max-w-xl mx-auto">
            Y-Plaza vous accompagne dans tous vos projets d'achat et de vente à travers la France.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl shadow-primary-900/40">
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Ville, quartier..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (window.location.href = `/properties${search ? `?city=${encodeURIComponent(search)}` : ''}`)}
                className="flex-1 py-2.5 text-gray-900 text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            <Link
              to={`/properties${search ? `?city=${encodeURIComponent(search)}` : ''}`}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm shrink-0"
            >
              <Search size={15} />
              Rechercher
            </Link>
          </div>

          {/* Quick city links */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {CITIES.map(city => (
              <Link
                key={city}
                to={`/properties?city=${city}`}
                className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/10"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-gray-100">
          {[
            { icon: <Users size={18} />, value: '12', label: 'Agences', sub: 'sur toute la France' },
            { icon: <Shield size={18} />, value: '500+', label: 'Biens', sub: 'disponibles maintenant' },
            { icon: <TrendingUp size={18} />, value: '98%', label: 'Satisfaction', sub: 'clients Y-Plaza' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3 px-6 first:pl-0 last:pr-0">
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="font-bold text-gray-900">{stat.value} <span className="text-sm font-semibold text-gray-600">{stat.label}</span></div>
                <div className="text-xs text-gray-400">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest properties */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Annonces récentes</p>
            <h2 className="text-3xl font-bold text-gray-900">Derniers biens disponibles</h2>
          </div>
          <Link to="/properties" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 group">
            Voir toutes les annonces
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-gray-500 font-medium">Aucune annonce pour le moment</p>
            <p className="text-sm text-gray-400 mt-1">Les biens publiés apparaîtront ici</p>
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link to="/properties" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600">
            Voir toutes les annonces <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Simple & rapide</p>
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Recherchez', desc: 'Parcourez nos annonces et filtrez par ville, type ou budget.' },
              { step: '02', title: 'Contactez', desc: "Prenez contact avec l'agent en charge du bien qui vous intéresse." },
              { step: '03', title: 'Concrétisez', desc: "Notre réseau de 12 agences vous accompagne jusqu'à la signature." },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Prêt à vendre votre bien ?</h2>
          <p className="text-primary-200 mb-8">Rejoignez Y-Plaza et bénéficiez de l'expertise de nos 12 agences.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm shadow-lg">
              Créer un compte gratuit
            </Link>
            <Link to="/agencies" className="border border-white/30 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
              Voir nos agences
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
