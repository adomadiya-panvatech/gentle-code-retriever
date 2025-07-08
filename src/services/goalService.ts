
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/goals';

export const getGoals = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getGoal = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createGoal = async (goal: any, token: string) =>
  (await axios.post(API_URL, goal, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateGoal = async (id: string, goal: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, goal, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteGoal = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;
