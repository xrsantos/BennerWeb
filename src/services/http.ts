import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://localhost:7147/api/',
  timeout: 10_000
});

