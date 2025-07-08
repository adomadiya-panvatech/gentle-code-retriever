import axios from 'axios';
const API_URL = 'http://localhost:5000/api/countries';

export const getCountries = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createCountry = async (country: any, token: string) =>
  (await axios.post(API_URL, country, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateCountry = async (id: string, country: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, country, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteCountry = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data; 