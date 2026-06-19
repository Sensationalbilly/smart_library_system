import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-gateway-url',
  timeout: 15000,
});

export async function analyzeRisk(text) {
  const res = await api.post('/risk', { text });
  return res.data;
}

export default { analyzeRisk };
