import axios from 'axios';

const API = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const fetchTasks = (projectId) =>
  axios.get(`${API}/tasks/project/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const createTask = (projectId, taskData) =>
  axios.post(`${API}/tasks/project/${projectId}`, taskData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateTask = (taskId, updates) =>
  axios.put(`${API}/tasks/${taskId}`, updates, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteTask = (taskId) =>
  axios.delete(`${API}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
