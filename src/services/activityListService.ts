
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/activity-lists';

export const getActivityLists = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createActivityList = async (list: any, token: string) =>
  (await axios.post(API_URL, list, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateActivityList = async (id: string, list: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, list, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteActivityList = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
