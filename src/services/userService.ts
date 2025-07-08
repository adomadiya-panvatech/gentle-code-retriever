
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export const getUsers = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getUser = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createUser = async (user: any, token: string) =>
  (await axios.post(API_URL, user, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateUser = async (id: string, user: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, user, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteUser = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const banUser = async (id: string, token: string) =>
  (await axios.put(`/api/users/${id}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } })).data;

export const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  banUser
};
