import { Building2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Building2 size={20} />
              Y-Plaza
            </div>
            <p className="text-sm">
              Groupe immobilier implanté en France avec siège à Aix-en-Provence et un réseau de 12 agences.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/properties" className="hover:text-white transition-colors">Annonces</a></li>
              <li><a href="/agencies" className="hover:text-white transition-colors">Agences</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">S'inscrire</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Siège : Aix-en-Provence</li>
              <li>contact@y-plaza.fr</li>
              <li>+33 4 00 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Y-Plaza. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
