import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-gray-100 select-none mb-2">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors">
            <ArrowLeft size={15} />
            Retour
          </button>
          <Link to="/"
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
            <Home size={15} />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
