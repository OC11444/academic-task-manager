import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this is http://localhost:8000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// The Interceptor: Attaches the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Adjust key name if necessary
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;