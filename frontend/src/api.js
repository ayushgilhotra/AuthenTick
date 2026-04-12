import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Verify
export const verifyToken = (token) => api.get(`/verify/${token}`);

// Medicines
export const getMedicines = () => api.get('/medicines');
export const createMedicine = (data) => api.post('/medicines', data);

// Batches
export const getBatches = () => api.get('/batches');
export const createBatch = (data) => api.post('/batches', data);

// Products
export const getProductsByBatch = (batchId) => api.get(`/products/batch/${batchId}`);
export const getProductQr = (id) => api.get(`/products/qr/${id}`);

// Reports
export const submitReport = (data) => api.post('/reports', data);
export const getReports = () => api.get('/reports');

// Analytics
export const getStats = () => api.get('/analytics/stats');
export const getScanActivity = () => api.get('/analytics/scans');
export const getRecentScans = () => api.get('/analytics/recent-scans');

// Settings
export const updateProfile = (data) => api.put('/settings/profile', data);
export const updatePassword = (data) => api.put('/settings/password', data);

// Contact
export const submitContact = (data) => api.post('/contact', data);

// Scan History
export const getScanHistory = () => api.get('/scan-history');

// Account
export const deleteAccount = () => api.delete('/settings/account');

// Notifications
export const getNotifications = () => api.get('/notifications');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Audit Logs
export const getAuditLogs = (page = 0, size = 20, action) => {
  const params = new URLSearchParams({ page, size });
  if (action) params.append('action', action);
  return api.get(`/audit-logs?${params.toString()}`);
};

export default api;
