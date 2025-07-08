
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/goal-categories';

export const getGoalCategories = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getGoalCategory = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createGoalCategory = async (category: any, token: string) =>
  (await axios.post(API_URL, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateGoalCategory = async (id: string, category: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteGoalCategory = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const goalCategoryService = {
  getGoalCategories,
  getGoalCategory,
  createGoalCategory,
  updateGoalCategory,
  deleteGoalCategory
};
