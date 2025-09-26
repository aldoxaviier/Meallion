import axios, {AxiosRequestConfig} from "axios";
import { AuthContext } from "../store/authContext";
import { useContext } from "react";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // your backend URL
});


export const attachTokenInterceptor = (getToken: () => string | null) => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

api.defaults.headers.common["Content-Type"] = "application/json";

export default api;