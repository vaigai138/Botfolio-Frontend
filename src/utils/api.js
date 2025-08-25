// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://botfolio-cfefazfsadadh0gm.southeastasia-01.azurewebsites.net/api',
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
