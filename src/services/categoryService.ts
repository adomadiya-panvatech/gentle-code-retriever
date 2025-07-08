
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/categories';

export const getCategories = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCategory = async (category: any, token: string) =>
  (await axios.post(API_URL, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCategory = async (id: string, category: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCategory = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
