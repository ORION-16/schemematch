import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function matchProfile(profile) {
  const { data } = await api.post('/api/schemes/match', { profile });
  return data;
}

export async function getAllSchemes(category) {
  const params = category ? { category } : {};
  const { data } = await api.get('/api/schemes', { params });
  return data;
}

export default api;
