
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/email-verification';

export const verifyEmail = async (data: any) =>
  (await axios.post(API_URL, data)).data;

export const resendVerificationEmail = async (id: string) =>
  (await axios.get(`${API_URL}/verify/${id}/resend`)).data;

export const verifyUser = async (id: string, data: any) =>
  (await axios.put(`${API_URL}/verify/${id}`, data)).data; 
