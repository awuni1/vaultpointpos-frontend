import client from './client'

export const getProducts = (params?: object) => client.get('/products/', { params })
export const getProduct = (id: number) => client.get(`/products/${id}/`)
export const getProductByBarcode = (barcode: string) => client.get(`/products/barcode/lookup/${encodeURIComponent(barcode)}/`)
export const createProduct = (data: object) => client.post('/products/', data)
export const updateProduct = (id: number, data: object) => client.patch(`/products/${id}/`, data)
export const deleteProduct = (id: number) => client.delete(`/products/${id}/`)

export const getCategories = () => client.get('/products/categories/')
export const createCategory = (data: object) => client.post('/products/categories/', data)
export const updateCategory = (id: number, data: object) => client.patch(`/products/categories/${id}/`, data)
export const deleteCategory = (id: number) => client.delete(`/products/categories/${id}/`)
