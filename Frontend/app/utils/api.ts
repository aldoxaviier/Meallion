import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

let refreshHandler: {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
} | null = null;

export const registerAuthHandlers = (login: any, logout: any) => {
  refreshHandler = { login, logout };
};

let tokenGetter: (() => string | null) | null = null;

export const setTokenGetter = (getter: () => string | null) => {
  tokenGetter = getter;
};

api.interceptors.request.use(
  (config) => {
    const token = tokenGetter?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken && refreshHandler) {
        try {
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccess = res.data.accessToken;
          const newRefresh = res.data.refreshToken;

          refreshHandler.login(newAccess, newRefresh);
          await SecureStore.setItemAsync("refreshToken", newRefresh);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (err) {
          refreshHandler.logout();
        }
      }
    }

    return Promise.reject(error);
  }
);

api.defaults.headers.common["Content-Type"] = "application/json";

export default api;
