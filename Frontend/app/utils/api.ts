import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // your backend URL
});

console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

api.defaults.headers.common["Content-Type"] = "application/json";

export default api;