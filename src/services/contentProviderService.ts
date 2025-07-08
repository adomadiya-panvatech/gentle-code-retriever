import axios from 'axios';
const API_URL = 'http://localhost:5000/api/content-providers';

export const getContentProviders = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createContentProvider = async (provider: any, token: string) =>
  (await axios.post(API_URL, provider, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateContentProvider = async (id: string, provider: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, provider, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteContentProvider = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 