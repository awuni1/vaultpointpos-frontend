import client from './client'

export const getSales = (params?: object) => client.get('/sales/', { params })
export const getSale = (id: number) => client.get(`/sales/${id}/`)
export const createSale = (data: object) => client.post('/sales/create/', data)
export const voidSale = (id: number) => client.post(`/sales/${id}/void/`)
export const refundSale = (id: number) => client.post(`/sales/${id}/refund/`)
export const holdSale = (id: number) => client.post(`/sales/${id}/hold/`)
export const resumeSale = (id: number) => client.post(`/sales/${id}/resume/`)
