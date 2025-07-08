import axios from 'axios';
const API_URL = 'http://localhost:5000/api/email-templates';

export const getEmailTemplates = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createEmailTemplate = async (template: any, token: string) =>
  (await axios.post(API_URL, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateEmailTemplate = async (id: string, template: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteEmailTemplate = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 