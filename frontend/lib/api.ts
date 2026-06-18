import axios from "axios";

const api = axios.create({
  baseURL: "https://adoption-system-production.up.railway.app/api",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export default api;
