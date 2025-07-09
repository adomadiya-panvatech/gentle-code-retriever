import axios from 'axios';
const API_URL = 'http://localhost:3000/api/personalization-rules';

export const getPersonalizationRules = async (token, params = {}) => {
  return (await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })).data;
};

export const getPersonalizationRule = async (id, token) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createPersonalizationRule = async (rule, token) =>
  (await axios.post(API_URL, rule, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updatePersonalizationRule = async (id, rule, token) =>
  (await axios.put(`${API_URL}/${id}`, rule, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deletePersonalizationRule = async (id, token) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const personalizationRuleService = {
  getPersonalizationRules,
  getPersonalizationRule,
  createPersonalizationRule,
  updatePersonalizationRule,
  deletePersonalizationRule,
}; 