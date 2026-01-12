
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5016/api", // Adjust this if backend is hosted elsewhere
});

export default api;