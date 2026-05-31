export type Role = 'CLIENT' | 'AGENT' | 'ADMIN'
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'LAND'
export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'PENDING'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
  token: string
}

export interface Property {
  id: number
  title: string
  description: string
  price: number
  surface: number
  city: string
  address: string
  type: PropertyType
  status: PropertyStatus
  agentName: string | null
  agencyName: string | null
  agencyId: number | null
  createdAt: string
}

export interface Agency {
  id: number
  name: string
  city: string
  address: string
  agentCount: number
}

export interface PropertyFilters {
  city?: string
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  minSurface?: number
}
