import { useState, useEffect } from 'react'
import { TrendingUp, Home, CheckCircle, Clock, BarChart2, AlertCircle } from 'lucide-react'
import { getAnalytics } from '../api/analytics'
import type { AnalyticsData } from '../api/analytics'

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  COMMERCIAL: 'Local commercial',
  LAND: 'Terrain',
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function BarChart({ data, maxValue, formatValue }: {
  data: { label: string; value: number }[]
  maxValue: number
  formatValue: (v: number) => string
}) {
  return (
    <div className="space-y-3">
      {data.map(({ label, value }) => (
        <div key={label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-gray-500">{formatValue(value)}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.max((value / maxValue) * 100, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">
      Chargement des analyses…
    </div>
  )

  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 items-start">
        <AlertCircle size={20} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-amber-800">Module d'analyse non disponible</p>
          <p className="text-sm text-amber-600 mt-1">
            Le serveur Python n'est pas démarré. Lance-le avec :
          </p>
          <code className="block mt-2 bg-amber-100 text-amber-800 text-xs px-3 py-2 rounded font-mono">
            cd data &amp;&amp; python api.py
          </code>
        </div>
      </div>
    </div>
  )

  if (!data) return null

  const { rapport_ventes: r, biens_populaires_par_ville: cities, prediction_model_metrics: model } = data

  const topCitiesByCount = [...cities].sort((a, b) => b.nombre_biens - a.nombre_biens).slice(0, 8)
  const topCitiesByPrice = [...cities].sort((a, b) => b.prix_moyen - a.prix_moyen).slice(0, 8)
  const maxCount = Math.max(...topCitiesByCount.map(c => c.nombre_biens), 1)
  const maxPrice = Math.max(...topCitiesByPrice.map(c => c.prix_moyen), 1)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analyse du marché</h1>
        <p className="text-gray-500 text-sm mt-1">
          Statistiques et prévisions générées automatiquement depuis les données Y-Plaza
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Home size={18} className="text-primary-600" />}
          label="Total des biens"
          value={r.total_biens}
          color="bg-primary-50"
        />
        <StatCard
          icon={<CheckCircle size={18} className="text-green-600" />}
          label="Disponibles"
          value={r.disponibles}
          sub={`${Math.round((r.disponibles / r.total_biens) * 100)}% du parc`}
          color="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-blue-600" />}
          label="Vendus"
          value={r.vendus}
          sub={`Taux : ${r.taux_vente_pct}%`}
          color="bg-blue-50"
        />
        <StatCard
          icon={<Clock size={18} className="text-yellow-600" />}
          label="Sous offre"
          value={r.sous_offre}
          color="bg-yellow-50"
        />
      </div>

      {/* Prix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Prix moyen</div>
          <div className="text-xl font-bold text-primary-600">{r.prix_moyen.toLocaleString('fr-FR')} €</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Prix médian</div>
          <div className="text-xl font-bold text-gray-900">{r.prix_median.toLocaleString('fr-FR')} €</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <div className="text-xs text-gray-400 mb-1">Surface moyenne</div>
          <div className="text-xl font-bold text-gray-900">{r.surface_moyenne.toLocaleString('fr-FR')} m²</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-900">Biens par ville</h2>
          </div>
          <BarChart
            data={topCitiesByCount.map(c => ({ label: c.city, value: c.nombre_biens }))}
            maxValue={maxCount}
            formatValue={v => `${v} bien${v > 1 ? 's' : ''}`}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-900">Prix moyen par ville</h2>
          </div>
          <BarChart
            data={topCitiesByPrice.map(c => ({ label: c.city, value: c.prix_moyen }))}
            maxValue={maxPrice}
            formatValue={v => `${Math.round(v).toLocaleString('fr-FR')} €`}
          />
        </div>
      </div>

      {/* Modèle de prédiction */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-1">Modèle de prédiction de prix</h2>
        <p className="text-xs text-gray-400 mb-4">
          Régression linéaire entraînée sur la surface, le type de bien et la ville
        </p>
        {model.error ? (
          <p className="text-sm text-gray-400 italic">{model.error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Échantillons</div>
              <div className="text-xl font-bold text-gray-900">{model.nb_samples}</div>
              <div className="text-xs text-gray-400">biens analysés</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Erreur moyenne (MAE)</div>
              <div className="text-xl font-bold text-gray-900">
                {model.mae != null ? `${Math.round(model.mae).toLocaleString('fr-FR')} €` : '—'}
              </div>
              <div className="text-xs text-gray-400">écart moyen de prédiction</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-1">Score R²</div>
              <div className={`text-xl font-bold ${
                (model.r2 ?? 0) > 0.7 ? 'text-green-600' :
                (model.r2 ?? 0) > 0.4 ? 'text-yellow-600' : 'text-red-500'
              }`}>
                {model.r2 != null ? (model.r2 * 100).toFixed(1) + '%' : '—'}
              </div>
              <div className="text-xs text-gray-400">qualité du modèle</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
