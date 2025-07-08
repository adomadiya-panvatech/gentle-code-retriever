
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/activity-types';

export const getActivityTypes = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createActivityType = async (type: any, token: string) =>
  (await axios.post(API_URL, type, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateActivityType = async (id: string, type: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, type, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteActivityType = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
