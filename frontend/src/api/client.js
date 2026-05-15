import axios from 'axios';

/**
 * api/client.js
 * 
 * Backend API ile iletişim kurmak için kullanılan merkezi istemci.
 * Axios kütüphanesini kullanarak temel ayarları (baseUrl vb.) burada yapıyoruz.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check testi için basit bir fonksiyon
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check Error:', error);
    throw error;
  }
};

export default apiClient;
