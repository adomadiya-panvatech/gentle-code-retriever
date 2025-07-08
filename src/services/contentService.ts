
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/content';

export const getContent = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const createContent = async (content: any, token: string) =>
  (await axios.post(API_URL, content, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateContent = async (id: string, content: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, content, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteContent = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;
