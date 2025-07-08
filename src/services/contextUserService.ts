import axios from 'axios';
const API_URL = 'http://localhost:5000/api/context-users';

export const getContextUsers = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createContextUser = async (contextUser: any, token: string) =>
  (await axios.post(API_URL, contextUser, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateContextUser = async (id: string, contextUser: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, contextUser, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteContextUser = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 