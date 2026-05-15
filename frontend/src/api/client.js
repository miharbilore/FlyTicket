import axios from 'axios';

/**
 * api/client.js
 * 
 * Bu dosya, frontend uygulamasının backend API ile konuşmasını sağlayan merkezi istemcidir.
 * 
 * Avantajları:
 * 1. Base URL (http://localhost:5000/api) tek bir yerden yönetilir.
 * 2. İstek başlıkları (headers) veya hata yönetimi merkezi olarak yapılabilir.
 * 3. Sayfalarda tekrar tekrar axios yazmak yerine, anlamlı fonksiyon isimleri kullanılır.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Şehir İşlemleri ---
export const getCities = async () => {
  const response = await apiClient.get('/cities');
  return response.data;
};

// --- Uçuş İşlemleri ---
export const getFlights = async (filters = {}) => {
  // query parametrelerini (from_city_id, to_city_id, date) url'ye ekler
  const response = await apiClient.get('/flights', { params: filters });
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await apiClient.get(`/flights/${id}`);
  return response.data;
};

// --- Bilet İşlemleri ---
export const createTicket = async (ticketData) => {
  const response = await apiClient.post('/tickets', ticketData);
  return response.data;
};

export const getTicketDetail = async (id) => {
  const response = await apiClient.get(`/tickets/detail/${id}`);
  return response.data;
};

export default apiClient;
