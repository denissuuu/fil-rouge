import api from './client'
import type { Agency } from '../types'

export const getAgencies = () => api.get<Agency[]>('/agencies').then(r => r.data)

export const getAgency = (id: number) => api.get<Agency>(`/agencies/${id}`).then(r => r.data)

export const createAgency = (data: Omit<Agency, 'id' | 'agentCount'>) =>
  api.post<Agency>('/agencies', data).then(r => r.data)
