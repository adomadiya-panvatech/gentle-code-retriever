
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/tips';

export const getTips = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTip = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTipByTitle = async (title: string, token: string) =>
  (await axios.get(`${API_URL}/title/${title}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createTip = async (tip: any, token: string) =>
  (await axios.post(API_URL, tip, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateTip = async (id: string, tip: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, tip, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getDailyTips = async (token: string) =>
  (await axios.get(`${API_URL}/daily`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getBarrierTips = async (taxonomyId: string, token: string) =>
  (await axios.get(`${API_URL}/barrier/${taxonomyId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getGoalTemplateBarrierTips = async (goalTemplateId: string, taxonomyId: string, token: string) =>
  (await axios.get(`${API_URL}/goal_template/${goalTemplateId}/barrier/${taxonomyId}`, { headers: { Authorization: `Bearer ${token}` } })).data;
