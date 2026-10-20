import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Image URLs ke liye: "http://localhost:4000/api" -> "http://localhost:4000"
export const IMAGE_BASE = API_BASE_URL.replace(/\/api$/, '');

// Product/category image ka pura URL banao (khaali/`null` par khaali string)
export const imageUrl = (image) =>
  image && image !== 'null' ? `${IMAGE_BASE}/${image}` : '';

// ===== Axios instance =====
// Har API call is instance se bhejenge, taake token apne aap attach ho
const api = axios.create({ baseURL: API_BASE_URL });

// Request interceptor: har request me Authorization header lagao
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: 401 (token invalid/expire) pe auto logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthCall = url.includes('/users/login') || url.includes('/users/register');
    // NOTE: Login/Register pe 401 = galat email/password ka error hai,
    // redirect nahi karna warna page reload ho jayega aur error message na dikhe
    if (err.response?.status === 401 && !isAuthCall) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---------- AUTH ----------
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);
export const getMe = () => api.get('/users/me');
export const changePassword = (data) => api.put('/users/change-password', data);

// ---------- CATEGORY ----------
// FormData aata hai -> axios khud multipart Content-Type set karta hai
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (formData) => api.post('/categories', formData);
export const updateCategory = (id, formData) => api.put(`/categories/${id}`, formData);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ---------- PRODUCT ----------
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (formData) => api.post('/products', formData);
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);