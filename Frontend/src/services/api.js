import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const donationService = {
  addDonation: (donationData) => api.post('/donations/add', donationData),
  getAllDonations: () => api.get('/donations/all'),
  getAvailableDonations: () => api.get('/donations/available'),
  getHotelDonations: (hotelId) => api.get(`/donations/hotel/${hotelId}`),
  getNGODonations: (ngoId) => api.get(`/donations/ngo/${ngoId}`),
  claimDonation: (donationId, ngoId) => api.post(`/donations/claim/${donationId}`, { ngo_id: ngoId }),
  updateDonation: (donationId, donationData) => api.put(`/donations/update/${donationId}`, donationData),
  deleteDonation: (donationId) => api.delete(`/donations/delete/${donationId}`),
};

export default api;
