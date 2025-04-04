import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export const submitApplication = (formData) => {
  return api.post('/candidates/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default api;