import client from './client'

export const getBranches = () => client.get('/branches/')
export const getBranch = (id: number) => client.get(`/branches/${id}/`)
export const createBranch = (data: object) => client.post('/branches/', data)
export const updateBranch = (id: number, data: object) => client.patch(`/branches/${id}/`, data)
export const getBranchInventory = (id: number, params?: object) => client.get(`/branches/${id}/inventory/`, { params })
export const getTransfers = () => client.get('/branches/transfers/')
export const createTransfer = (data: object) => client.post('/branches/transfers/', data)
export const approveTransfer = (id: number, action: 'approve' | 'reject') =>
  client.post(`/branches/transfers/${id}/approve/`, { action })
export const getConsolidatedReport = (params?: object) => client.get('/branches/reports/consolidated/', { params })
