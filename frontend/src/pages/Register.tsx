import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { register as registerApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await registerApi(form)
      login(user)
      navigate('/dashboard')
    } catch {
      setError('Inscription impossible. Cet email est peut-être déjà utilisé.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white'

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 size={18} className="text-white" />
            </div>
            Y-Plaza
          </Link>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Rejoignez<br />la plateforme N°1<br />de l'immobilier
          </h2>
          <p className="text-primary-200 text-base">
            Accédez aux meilleures annonces, gérez vos biens et collaborez avec nos agents.
          </p>
          <div className="mt-8 space-y-3">
            {[
              '✓ Accès à toutes les annonces',
              '✓ Contact direct avec les agents',
              '✓ Tableau de bord personnalisé',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-primary-100 text-sm">{item}</div>
            ))}
          </div>
        </div>

        <p className="relative text-primary-300 text-sm">© {new Date().getFullYear()} Y-Plaza</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-gray-900">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 size={15} className="text-white" />
              </div>
              Y-<span className="text-primary-600">Plaza</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h1>
          <p className="text-gray-500 text-sm mb-7">Rejoignez Y-Plaza en quelques secondes.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={form.firstName} onChange={set('firstName')} className={inputClass} placeholder="Jean" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={form.lastName} onChange={set('lastName')} className={inputClass} placeholder="Dupont" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={set('email')} className={inputClass} placeholder="vous@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required minLength={6} value={form.password} onChange={set('password')} className={inputClass} placeholder="Minimum 6 caractères" />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-sm disabled:opacity-60 shadow-sm shadow-primary-200 mt-2"
            >
              {loading ? 'Création...' : <>Créer mon compte <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
