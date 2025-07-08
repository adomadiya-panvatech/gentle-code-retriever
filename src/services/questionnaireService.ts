
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/questionnaire';

export const getQuestionnaires = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getQuestionnaireTitles = async (token: string) =>
  (await axios.get(`${API_URL}/titles`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getQuestionnaire = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createQuestionnaire = async (questionnaire: any, token: string) =>
  (await axios.post(API_URL, questionnaire, { headers: { Authorization: `Bearer ${token}` } })).data;

export const duplicateQuestionnaire = async (id: string, token: string) =>
  (await axios.post(`${API_URL}/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateQuestionnaire = async (id: string, questionnaire: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, questionnaire, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createPanel = async (id: string, panel: any, token: string) =>
  (await axios.post(`${API_URL}/${id}/panels`, panel, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updatePanel = async (id: string, panelId: string, panel: any, token: string) =>
  (await axios.put(`${API_URL}/${id}/panels/${panelId}`, panel, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getPanel = async (id: string, panelId: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/panels/${panelId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getPanels = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/panels`, { headers: { Authorization: `Bearer ${token}` } })).data;
