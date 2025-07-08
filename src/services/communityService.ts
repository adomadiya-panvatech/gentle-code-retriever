
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/community';

export const getCommunities = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCommunity = async (community: any, token: string) =>
  (await axios.post(API_URL, community, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCommunity = async (id: string, community: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, community, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCommunity = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
