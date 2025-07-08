import axios from 'axios';
const API_URL = 'http://localhost:5000/api/forgot-passwords';

export const requestPasswordReset = async (email: string) =>
  (await axios.post(API_URL, { email })).data;

export const validateResetToken = async (token: string) =>
  (await axios.get(`${API_URL}/${token}`)).data;

export const resetPassword = async (token: string, password: string) =>
  (await axios.patch(`${API_URL}/${token}`, { password })).data; 