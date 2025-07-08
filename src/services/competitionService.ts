
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/competitions';

export const getCompetitions = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCompetition = async (competition: any, token: string) =>
  (await axios.post(API_URL, competition, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCompetition = async (id: string, competition: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, competition, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCompetition = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 
