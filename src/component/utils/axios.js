import axios from 'axios';
import store from '../../redux/store';

// Custom axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API
});

axiosInstance.interceptors.request.use((config) => {
  const user = store.getState().source?.account || {id: null, lastUpdated: null}; // atau ambil dari context kalau kamu pakai

  if (user?.id && user?.lastUpdated) {
    config.headers['X-User-ID'] = user._id;
    config.headers['X-User-Last-Updated'] = user.lastUpdated;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept response: handle kalau perlu logout paksa
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 409) {
    alert('Profil kamu berubah. Silakan login ulang.');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return Promise.reject(error);
});

export default axiosInstance;
