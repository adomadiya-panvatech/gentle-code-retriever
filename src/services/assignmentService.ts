
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/assignments';

export const getAssignments = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getAssignment = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createAssignment = async (assignment: any, token: string) =>
  (await axios.post(API_URL, assignment, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateAssignment = async (id: string, assignment: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, assignment, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteAssignment = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const assignmentService = {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
