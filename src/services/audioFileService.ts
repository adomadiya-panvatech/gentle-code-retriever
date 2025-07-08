
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/audio-files';

export const getAudioFiles = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getAudioFile = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createAudioFile = async (audioFile: any, token: string) =>
  (await axios.post(API_URL, audioFile, { headers: { Authorization: `Bearer ${token}` } })).data;
