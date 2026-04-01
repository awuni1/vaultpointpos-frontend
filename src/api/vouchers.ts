import client from './client'

export const getVouchers = () => client.get('/vouchers/')
export const createVoucher = (data: object) => client.post('/vouchers/', data)
export const updateVoucher = (id: number, data: object) => client.patch(`/vouchers/${id}/`, data)
export const deleteVoucher = (id: number) => client.delete(`/vouchers/${id}/`)
export const validateVoucher = (data: object) => client.post('/vouchers/validate/', data)
export const redeemVoucher = (data: object) => client.post('/vouchers/redeem/', data)
export const getGiftCards = () => client.get('/vouchers/gift-cards/')
export const createGiftCard = (data: object) => client.post('/vouchers/gift-cards/', data)
export const getGiftCardBalance = (code: string) => client.get(`/vouchers/gift-cards/${code}/balance/`)
export const redeemGiftCard = (code: string, data: object) => client.post(`/vouchers/gift-cards/${code}/redeem/`, data)
