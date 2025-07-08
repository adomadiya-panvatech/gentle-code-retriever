
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/content-collections';

export const getContentCollections = async (token: string) =>
  (await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createContentCollection = async (collection: any, token: string) =>
  (await axios.post(API_URL, collection, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateContentCollection = async (id: string, collection: any, token: string) =>
  (await axios.patch(`${API_URL}/${id}`, collection, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteContentCollection = async (id: string, token: string) =>
  (await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const contentCollectionService = {
  getContentCollections,
  createContentCollection,
  updateContentCollection,
  deleteContentCollection
};
