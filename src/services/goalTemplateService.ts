
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/goal-templates';

export const getGoalTemplates = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getGoalTemplate = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createGoalTemplate = async (template: any, token: string) =>
  (await axios.post(API_URL, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateGoalTemplate = async (id: string, template: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteGoalTemplate = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;
