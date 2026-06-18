import axios from "axios";

const api = axios.create({
  baseURL: "https://adoption-system-production.up.railway.app/api",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
