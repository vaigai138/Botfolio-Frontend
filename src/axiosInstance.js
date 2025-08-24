// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://botfolio-cfefazfsadadh0gm.southeastasia-01.azurewebsites.net',
});

// Optional: attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
