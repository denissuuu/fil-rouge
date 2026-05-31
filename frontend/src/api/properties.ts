import api from './client'
import type { Property, PropertyFilters } from '../types'

export const getProperties = () => api.get<Property[]>('/properties').then(r => r.data)

export const getProperty = (id: number) => api.get<Property>(`/properties/${id}`).then(r => r.data)

export const getPropertiesByCity = (city: string) =>
  api.get<Property[]>(`/properties/city/${encodeURIComponent(city)}`).then(r => r.data)

export const createProperty = (data: Omit<Property, 'id' | 'createdAt' | 'agentName' | 'agencyName'>) =>
  api.post<Property>('/properties', data).then(r => r.data)

export const updateProperty = (id: number, data: Partial<Property>) =>
  api.put<Property>(`/properties/${id}`, data).then(r => r.data)

export const deleteProperty = (id: number) => api.delete(`/properties/${id}`)

export const filterProperties = (properties: Property[], filters: PropertyFilters): Property[] => {
  return properties.filter(p => {
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.minPrice && p.price < filters.minPrice) return false
    if (filters.maxPrice && p.price > filters.maxPrice) return false
    if (filters.minSurface && p.surface < filters.minSurface) return false
    return true
  })
}
