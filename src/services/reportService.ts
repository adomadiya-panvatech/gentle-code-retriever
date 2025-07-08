import axios from 'axios';
const API_URL = 'http://localhost:5000/api/reports';

export const getReports = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createReport = async (report: any, token: string) =>
  (await axios.post(API_URL, report, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateReport = async (id: string, report: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, report, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteReport = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getReportById = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const reportFeed = async (feedId: string, reason: string, token: string) =>
  (await axios.post(`http://localhost:5000/api/feeds/${feedId}/reports`, { reason }, { headers: { Authorization: `Bearer ${token}` } })).data; 