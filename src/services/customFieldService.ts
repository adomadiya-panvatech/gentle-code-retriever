import axios from 'axios';
const API_URL = 'http://localhost:5000/api/custom-fields';

export const getCustomFields = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCustomField = async (customField: any, token: string) =>
  (await axios.post(API_URL, customField, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCustomField = async (id: string, customField: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, customField, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCustomField = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 