import axios from 'axios';
const API_URL = 'http://localhost:5000/api/devices';

export const getDevices = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createDevice = async (device: any, token: string) =>
  (await axios.post(API_URL, device, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateDevice = async (id: string, device: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, device, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteDevice = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 