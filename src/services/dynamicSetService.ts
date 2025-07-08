
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/dynamic-sets';

export const getDynamicSetByTag = async (tag: string, token: string) =>
  (await axios.get(`${API_URL}/${tag}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getDynamicSetByTagPost = async (data: any, token: string) =>
  (await axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } })).data; 
