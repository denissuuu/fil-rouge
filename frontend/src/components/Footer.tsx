import { Link } from 'react-router-dom'
import { Building2, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 size={15} className="text-white" />
              </div>
              Y-Plaza
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Groupe immobilier implanté en France avec siège à Aix-en-Provence et un réseau de 12 agences sur le territoire national.
            </p>
            <div className="flex flex-col gap-1.5 mt-4 text-sm">
              <div className="flex items-center gap-2"><MapPin size={13} className="text-primary-500" /> Aix-en-Provence, France</div>
              <div className="flex items-center gap-2"><Mail size={13} className="text-primary-500" /> contact@y-plaza.fr</div>
              <div className="flex items-center gap-2"><Phone size={13} className="text-primary-500" /> +33 4 00 00 00 00</div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/properties', label: 'Annonces' },
                { to: '/agencies', label: 'Agences' },
                { to: '/analytics', label: 'Marché immobilier' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Mon compte</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/login', label: 'Connexion' },
                { to: '/register', label: 'Inscription' },
                { to: '/dashboard', label: 'Tableau de bord' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Y-Plaza. Tous droits réservés.</span>
          <span>Développé avec React, Spring Boot &amp; Python</span>
        </div>
      </div>
    </footer>
  )
}
