// src/services/authService.js
import API from '../utils/api';

export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);
