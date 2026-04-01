import client from './client'

export const getShifts = () => client.get('/shifts/')
export const startShift = (data: object) => client.post('/shifts/start/', data)
export const getShift = (id: number) => client.get(`/shifts/${id}/`)
export const endShift = (id: number, data: object) => client.post(`/shifts/${id}/end/`, data)
export const getReconciliation = (id: number) => client.get(`/shifts/${id}/reconciliation/`)
export const submitReconciliation = (id: number, data: object) => client.post(`/shifts/${id}/reconciliation/`, data)
