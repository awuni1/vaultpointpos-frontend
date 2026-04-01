import client from './client'

export const getCustomers = (params?: object) => client.get('/customers/', { params })
export const getCustomer = (id: number) => client.get(`/customers/${id}/`)
export const createCustomer = (data: object) => client.post('/customers/', data)
export const updateCustomer = (id: number, data: object) => client.patch(`/customers/${id}/`, data)
export const deleteCustomer = (id: number) => client.delete(`/customers/${id}/`)
export const getCustomerHistory = (id: number) => client.get(`/customers/${id}/history/`)
export const getTopCustomers = () => client.get('/customers/top/')
