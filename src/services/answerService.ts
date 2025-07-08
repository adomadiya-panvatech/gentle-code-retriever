
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/answers';

export const getAnswers = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createAnswer = async (answer: any, token: string) =>
  (await axios.post(API_URL, answer, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateAnswer = async (id: string, answer: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, answer, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteAnswer = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
