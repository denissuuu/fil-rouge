// Appelle le module Python Flask sur le port 5001
const BASE = 'http://localhost:5001'

export interface CityStats {
  city: string
  nombre_biens: number
  prix_moyen: number
  surface_moyenne: number
}

export interface SalesSummary {
  total_biens: number
  vendus: number
  disponibles: number
  sous_offre: number
  taux_vente_pct: number
  prix_moyen: number
  prix_median: number
  surface_moyenne: number
}

export interface ModelMetrics {
  mae?: number
  r2?: number
  nb_samples?: number
  error?: string
}

export interface AnalyticsData {
  rapport_ventes: SalesSummary
  biens_populaires_par_ville: CityStats[]
  prediction_model_metrics: ModelMetrics
}

export const getAnalytics = (): Promise<AnalyticsData> =>
  fetch(`${BASE}/api/analytics`).then(r => {
    if (!r.ok) throw new Error('Erreur API')
    return r.json()
  })

export const getCities = (): Promise<CityStats[]> =>
  fetch(`${BASE}/api/analytics/cities`).then(r => r.json())
