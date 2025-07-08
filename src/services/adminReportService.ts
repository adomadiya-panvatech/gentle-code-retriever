
import axios from 'axios';

export const getReports = async (token: string, filters = {}) => {
  const params = new URLSearchParams(filters as any).toString();
  return (await axios.get(`http://localhost:3000/api/feeds/0/reports?${params}`, { headers: { Authorization: `Bearer ${token}` } })).data;
};

export const updateReportStatus = async (reportId: string, status: string, token: string) =>
  (await axios.put(`http://localhost:3000/api/feeds/0/reports/${reportId}`, { status }, { headers: { Authorization: `Bearer ${token}` } })).data; 
