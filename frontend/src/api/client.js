import axios from 'axios';

/**
 * api/client.js
 * 
 * Bu dosya, frontend uygulamasının backend API ile konuşmasını sağlayan merkezi istemcidir.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin işlemleri için token ekleyen yardımcı fonksiyon
const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

/**
 * Admin işlemleri neden token gerektirir?
 * Çünkü bu işlemler (uçuş ekleme/silme vb.) hassastır. JWT token, sunucuya 
 * bu isteği yapanın yetkili bir admin olduğunu kanıtlar.
 * 
 * localStorage kullanımı: Bu projede token'ı localStorage'da saklıyoruz çünkü 
 * basit ve etkili. Production'da 'httpOnly cookie' kullanımı daha güvenlidir (XSS riskine karşı).
 */

// --- Şehir İşlemleri ---
export const getCities = async () => {
  const response = await apiClient.get('/cities');
  return response.data;
};

// --- Uçuş İşlemleri (Public) ---
export const getFlights = async (filters = {}) => {
  const response = await apiClient.get('/flights', { params: filters });
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await apiClient.get(`/flights/${id}`);
  return response.data;
};

// --- Bilet İşlemleri (Public) ---
export const createTicket = async (ticketData) => {
  const response = await apiClient.post('/tickets', ticketData);
  return response.data;
};

export const getTicketDetail = async (id) => {
  const response = await apiClient.get(`/tickets/detail/${id}`);
  return response.data;
};

// --- Admin Auth İşlemleri ---
export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// --- Admin CRUD İşlemleri ---
export const getAdminFlights = async (token) => {
  const response = await apiClient.get('/admin/flights', getAuthHeaders(token));
  return response.data;
};

export const createAdminFlight = async (token, flightData) => {
  const response = await apiClient.post('/admin/flights', flightData, getAuthHeaders(token));
  return response.data;
};

export const updateAdminFlight = async (token, flightId, flightData) => {
  const response = await apiClient.put(`/admin/flights/${flightId}`, flightData, getAuthHeaders(token));
  return response.data;
};

export const deleteAdminFlight = async (token, flightId) => {
  const response = await apiClient.delete(`/admin/flights/${flightId}`, getAuthHeaders(token));
  return response.data;
};

export const getAdminTickets = async (token) => {
  const response = await apiClient.get('/admin/tickets', getAuthHeaders(token));
  return response.data;
};

export default apiClient;
