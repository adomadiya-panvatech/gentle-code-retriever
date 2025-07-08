
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (email: string, password: string, name: string) => {
  const res = await axios.post(`${API_URL}/register`, { email, password, name });
  return res.data;
}; 
