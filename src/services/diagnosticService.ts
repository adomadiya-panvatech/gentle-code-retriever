import axios from 'axios';
const API_URL = 'http://localhost:5000/api/diagnostics';

export const getDiagnostics = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createDiagnostic = async (diagnostic: any, token: string) =>
  (await axios.post(API_URL, diagnostic, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateDiagnostic = async (id: string, diagnostic: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, diagnostic, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteDiagnostic = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 