
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/videos';

export const getVideos = async (token: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  return (await axios.get(`${API_URL}?${params}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  })).data;
};

export const getVideo = async (id: string, token: string) =>
  (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createVideo = async (video: any, token: string) =>
  (await axios.post(API_URL, video, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateVideo = async (id: string, video: any, token: string) =>
  (await axios.put(`${API_URL}/${id}`, video, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getVimeoVideo = async (vimeoId: string, token: string) =>
  (await axios.get(`${API_URL}/vimeo/${vimeoId}`, { headers: { Authorization: `Bearer ${token}` } })).data;
