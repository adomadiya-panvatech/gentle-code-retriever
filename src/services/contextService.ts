import axios from 'axios';
const API_URL = 'http://localhost:5000/api/contexts';

export const getContexts = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createContext = async (context: any, token: string) =>
  (await axios.post(API_URL, context, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateContext = async (id: string, context: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, context, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteContext = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 