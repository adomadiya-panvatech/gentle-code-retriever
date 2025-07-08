import axios from 'axios';
const API_URL = 'http://localhost:5000/api/custom-field-values';

export const getCustomFieldValues = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCustomFieldValue = async (customFieldValue: any, token: string) =>
  (await axios.post(API_URL, customFieldValue, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCustomFieldValue = async (id: string, customFieldValue: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, customFieldValue, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCustomFieldValue = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 