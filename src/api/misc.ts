import client from './client'

// Payments
export const getPayments = () => client.get('/payments/')
export const getCashReconciliation = () => client.get('/payments/reconciliation/')
export const initiateMomo = (data: { sale_id: number; phone: string; provider: string; email?: string }) =>
  client.post('/payments/momo/initiate/', data)
export const submitMomoOtp = (data: { reference: string; otp: string }) =>
  client.post('/payments/momo/submit-otp/', data)
export const verifyMomoPayment = (data: { reference: string }) =>
  client.post('/payments/paystack/verify/', data)

// Receipts
export const getReceipt = (saleId: number) => client.get(`/receipts/${saleId}/`)

// Targets
export const getTargets = () => client.get('/targets/')
export const createTarget = (data: object) => client.post('/targets/', data)
export const getTargetProgress = () => client.get('/targets/progress/')
export const getLeaderboard = () => client.get('/targets/leaderboard/')
export const getAchievements = () => client.get('/targets/achievements/')
export const getMyAchievements = () => client.get('/targets/achievements/mine/')

// Forecasting
export const getProductForecast = (id: number) => client.get(`/forecasting/products/${id}/`)
export const getStoreForecast = () => client.get('/forecasting/store/')
export const getStockoutRisk = () => client.get('/forecasting/stockout-risk/')

// Audit
export const getAuditLogs = (params?: object) => client.get('/audit/logs/', { params })
export const getAnomalies = () => client.get('/audit/anomalies/')

// Integrations
export const getApiKeys = () => client.get('/integrations/api-keys/')
export const createApiKey = (data: object) => client.post('/integrations/api-keys/', data)
export const deleteApiKey = (id: number) => client.delete(`/integrations/api-keys/${id}/`)
export const rotateApiKey = (id: number) => client.post(`/integrations/api-keys/${id}/rotate/`)
export const getWebhooks = () => client.get('/integrations/webhooks/')
export const createWebhook = (data: object) => client.post('/integrations/webhooks/', data)
export const deleteWebhook = (id: number) => client.delete(`/integrations/webhooks/${id}/`)
export const testWebhook = (id: number) => client.post(`/integrations/webhooks/${id}/test/`)

// Notifications
export const getNotificationLogs = () => client.get('/notifications/logs/')
export const sendReceiptEmail = (data: object) => client.post('/notifications/receipt-email/', data)
export const sendDailySummary = () => client.post('/notifications/daily-summary/')
