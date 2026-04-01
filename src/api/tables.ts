import client from './client'

export const getTables = () => client.get('/tables/')
export const createTable = (data: object) => client.post('/tables/', data)
export const getFloorPlan = (branchId: number) => client.get(`/tables/floor-plan/${branchId}/`)
export const createFloorPlan = (branchId: number, data: object) => client.post(`/tables/floor-plan/${branchId}/`, data)
export const updateTableStatus = (id: number, status: string) => client.patch(`/tables/${id}/status/`, { status })
export const createTableOrder = (tableId: number, data: object) => client.post(`/tables/${tableId}/order/`, data)
export const getTableOrder = (id: number) => client.get(`/tables/orders/${id}/`)
export const updateTableOrder = (id: number, data: object) => client.patch(`/tables/orders/${id}/`, data)
export const splitBill = (id: number, split_by: number) => client.post(`/tables/orders/${id}/split/`, { split_by })
export const getKitchenTickets = () => client.get('/tables/kitchen/')
export const updateKitchenTicket = (id: number, status: string) => client.patch(`/tables/kitchen/${id}/`, { status })
