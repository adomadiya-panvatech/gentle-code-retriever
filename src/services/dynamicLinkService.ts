
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/dynamic-links';

export const getDynamicLink = async (data: any, token: string) =>
  (await axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getAppSharingLink = async (token: string) =>
  (await axios.get(`${API_URL}/share_app`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getActivityListTemplateSharingLink = async (activityListTemplateId: string, token: string) =>
  (await axios.get(`${API_URL}/share_activity_list_template/${activityListTemplateId}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getPlanSharingLink = async (data: any, token: string) =>
  (await axios.post(`${API_URL}/share_plan`, data, { headers: { Authorization: `Bearer ${token}` } })).data; 
