
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/comments';

export const getComments = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createComment = async (comment: any, token: string) =>
  (await axios.post(API_URL, comment, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateComment = async (id: string, comment: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, comment, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteComment = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
