import client from './client'

export const getInventory = () => client.get('/inventory/')
export const adjustStock = (data: object) => client.post('/inventory/adjust/', data)
export const receiveStock = (data: object) => client.post('/inventory/receive/', data)
export const getMovements = () => client.get('/inventory/movements/')
export const getLowStock = () => client.get('/inventory/low-stock/')
export const getDeadStock = () => client.get('/inventory/dead-stock/')
export const getReorderSuggestions = () => client.get('/inventory/reorder-suggestions/')
