
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/community-groups';

export const getCommunityGroups = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getCommunityGroup = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCommunityGroup = async (group: any, token: string) =>
  (await axios.post(API_URL, group, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCommunityGroup = async (id: string, group: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, group, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCommunityGroup = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const communityGroupService = {
  getCommunityGroups,
  getCommunityGroup,
  createCommunityGroup,
  updateCommunityGroup,
  deleteCommunityGroup
};
