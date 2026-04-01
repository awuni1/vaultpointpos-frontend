import client from './client'

export const login = (username: string, password: string) =>
  client.post('/auth/login/', { username, password })

export const logout = (refresh: string) =>
  client.post('/auth/logout/', { refresh })

export const getMe = () => client.get('/auth/me/')
export const getUsers = () => client.get('/auth/users/')
export const getUser = (id: string) => client.get(`/auth/users/${id}/`)
export const updateUser = (id: string, data: object) => client.patch(`/auth/users/${id}/`, data)
export const registerUser = (data: object) => client.post('/auth/register/', data)
export const changePassword = (data: object) => client.post('/auth/change-password/', data)
export const adminResetPassword = (id: string, data: object) => client.post(`/auth/users/${id}/reset-password/`, data)
export const getSettings = () => client.get('/auth/settings/')
export const updateSettings = (data: object) => client.patch('/auth/settings/', data)
