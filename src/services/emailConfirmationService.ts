import axios from 'axios';
const API_URL = 'http://localhost:5000/api/email-confirmations';

export const getEmailConfirmations = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createEmailConfirmation = async (confirmation: any, token: string) =>
  (await axios.post(API_URL, confirmation, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateEmailConfirmation = async (id: string, confirmation: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, confirmation, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteEmailConfirmation = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 