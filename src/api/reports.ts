import client from './client'

export const getDailyReport = (params?: object) => client.get('/reports/daily/', { params })
export const getWeeklyReport = (params?: object) => client.get('/reports/weekly/', { params })
export const getMonthlyReport = (params?: object) => client.get('/reports/monthly/', { params })
export const getProductPerformance = (params?: object) => client.get('/reports/products/', { params })
export const getCashierPerformance = () => client.get('/reports/cashiers/')
export const getPaymentMethodReport = (params?: object) => client.get('/reports/payment-methods/', { params })
export const getCategoryRevenue = (params?: object) => client.get('/reports/category-revenue/', { params })
export const getCustomerReport = (params?: object) => client.get('/reports/customers/', { params })
export const getInventoryReport = () => client.get('/reports/inventory/')
