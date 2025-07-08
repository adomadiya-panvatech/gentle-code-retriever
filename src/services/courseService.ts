import axios from 'axios';
const API_URL = 'http://localhost:5000/api/courses';

export const getCourses = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCourse = async (course: any, token: string) =>
  (await axios.post(API_URL, course, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCourse = async (id: string, course: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, course, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCourse = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 