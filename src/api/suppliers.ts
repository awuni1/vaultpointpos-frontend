import client from './client'

export const getSuppliers = () => client.get('/suppliers/')
export const getSupplier = (id: number) => client.get(`/suppliers/${id}/`)
export const createSupplier = (data: object) => client.post('/suppliers/', data)
export const updateSupplier = (id: number, data: object) => client.patch(`/suppliers/${id}/`, data)
export const getSupplierPerformance = (id: number) => client.get(`/suppliers/${id}/performance/`)
export const getPurchaseOrders = () => client.get('/suppliers/orders/')
export const getPurchaseOrder = (id: number) => client.get(`/suppliers/orders/${id}/`)
export const createPurchaseOrder = (data: object) => client.post('/suppliers/orders/', data)
export const approvePO = (id: number) => client.post(`/suppliers/orders/${id}/approve/`)
export const receivePO = (id: number, data: object) => client.post(`/suppliers/orders/${id}/receive/`, data)
