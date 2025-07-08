
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/authorization-codes';

export const getAuthorizationCodes = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createAuthorizationCode = async (code: any, token: string) =>
  (await axios.post(API_URL, code, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateAuthorizationCode = async (id: string, code: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, code, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteAuthorizationCode = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
