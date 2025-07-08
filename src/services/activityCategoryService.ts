
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/activity-categories';

export const getActivityCategories = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createActivityCategory = async (category: any, token: string) =>
  (await axios.post(API_URL, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateActivityCategory = async (id: string, category: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteActivityCategory = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
