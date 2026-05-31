import api from './client'
import type { User } from '../types'

interface LoginPayload { email: string; password: string }
interface RegisterPayload { firstName: string; lastName: string; email: string; password: string }

export const login = (data: LoginPayload) => api.post<User>('/auth/login', data).then(r => r.data)

export const register = (data: RegisterPayload) => api.post<User>('/auth/register', data).then(r => r.data)
