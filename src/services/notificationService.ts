import axios from 'axios';
const API_URL = 'http://localhost:5000/api/notifications';

export const getNotifications = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createNotification = async (notification: any, token: string) =>
  (await axios.post(API_URL, notification, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateNotification = async (id: string, notification: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, notification, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteNotification = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const markAsRead = async (id: string, token: string) =>
  (await axios.put(`${API_URL}/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } })).data; 