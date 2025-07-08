
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/course-categories';

export const getCourseCategories = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCourseCategory = async (category: any, token: string) =>
  (await axios.post(API_URL, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCourseCategory = async (id: string, category: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, category, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCourseCategory = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;
