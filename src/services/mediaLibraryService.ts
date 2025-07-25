
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/media-library';

export const getMediaLibrarys = async (token: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return (await axios.get(`${API_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
    })).data;
};

export const getMediaLibrary = async (id: string, token: string) =>
    (await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const createMediaLibrary = async (video: any, token: string) =>
    (await axios.post(API_URL, video, { headers: { Authorization: `Bearer ${token}` } })).data;

export const updateMediaLibrary = async (id: string, video: any, token: string) =>
    (await axios.put(`${API_URL}/${id}`, video, { headers: { Authorization: `Bearer ${token}` } })).data;

export const deleteMediaLibrary = async (id: string, token: string) =>
    (await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })).data;