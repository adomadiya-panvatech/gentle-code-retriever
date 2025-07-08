
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/taxonomies';

export const getTaxonomies = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getTaxonomy = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTaxonomyMetrics = async (token: string) =>
  (await axios.get(`${API_URL}/metrics`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getAssignableTaxonomies = async (token: string) =>
  (await axios.get(`${API_URL}/assignable`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTaxonomyDescendants = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/descendants`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTaxonomyChildren = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}/children`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getTaxonomyByName = async (name: string, token: string) =>
  (await axios.get(`${API_URL}/name/${name}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateTaxonomy = async (id: string, taxonomy: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, taxonomy, { headers: { Authorization: `Bearer ${token}` } })).data;
