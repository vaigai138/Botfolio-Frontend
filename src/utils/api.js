import axios from 'axios';

const API = axios.create({
  baseURL: 'botfolio-backend-production.up.railway.app/api',
});

// Add token to each request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
