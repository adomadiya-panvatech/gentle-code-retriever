
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/companies';

export const getCompanies = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCompany = async (company: any, token: string) =>
  (await axios.post(API_URL, company, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCompany = async (id: string, company: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, company, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCompany = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const companyService = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};
