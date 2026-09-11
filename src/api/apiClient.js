import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://119.13.189.233:80/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("dms_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;