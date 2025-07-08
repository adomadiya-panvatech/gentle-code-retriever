
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/activity-list-templates';

export const getActivityListTemplates = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getRecommendedActivityListTemplates = async (token: string) =>
  (await axios.get(`${API_URL}/recommended`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getActivityListTemplate = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createActivityListTemplate = async (template: any, token: string) =>
  (await axios.post(API_URL, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateActivityListTemplate = async (id: string, template: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, template, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createVetterTag = async (id: string, vetterTag: any, token: string) =>
  (await axios.post(`${API_URL}/${id}/vetter-tags`, vetterTag, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getVetterTags = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/vetter-tags`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getVetterTag = async (id: string, tagId: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/vetter-tags/${tagId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateVetterTag = async (id: string, tagId: string, vetterTag: any, token: string) =>
  (await axios.put(`${API_URL}/${id}/vetter-tags/${tagId}`, vetterTag, { headers: { Authorization: `Bearer ${token}` } })).data;
