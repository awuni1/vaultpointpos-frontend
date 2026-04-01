import client from './client'

export const getExpenses = (params?: object) => client.get('/expenses/', { params })
export const createExpense = (data: object) => client.post('/expenses/', data)
export const updateExpense = (id: number, data: object) => client.patch(`/expenses/${id}/`, data)
export const deleteExpense = (id: number) => client.delete(`/expenses/${id}/`)
export const getExpenseCategories = () => client.get('/expenses/categories/')
export const createExpenseCategory = (data: object) => client.post('/expenses/categories/', data)
export const updateExpenseCategory = (id: number, data: object) => client.patch(`/expenses/categories/${id}/`, data)
export const deleteExpenseCategory = (id: number) => client.delete(`/expenses/categories/${id}/`)
export const getExpenseSummary = (params?: object) => client.get('/expenses/summary/', { params })
export const getProfitReport = (params?: object) => client.get('/expenses/profit/', { params })
