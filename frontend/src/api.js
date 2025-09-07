import axios from "axios";

const api = axios.create({
  baseURL: "https://resume-analysis-1-pz4k.onrender.com", // backend URL
});

export default api;
