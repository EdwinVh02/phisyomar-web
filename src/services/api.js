import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // tu backend Laravel
  withCredentials: true,
});

export default api;
