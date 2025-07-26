// src/services/taskService.js
import API from '../utils/api';

export const fetchTasks = (projectId) =>
  API.get(`/tasks/project/${projectId}`);

export const createTask = (projectId, taskData) =>
  API.post(`/tasks/project/${projectId}`, taskData);

export const updateTask = (taskId, updates) =>
  API.put(`/tasks/${taskId}`, updates);

export const deleteTask = (taskId) =>
  API.delete(`/tasks/${taskId}`);
