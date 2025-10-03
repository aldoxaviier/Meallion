import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

let refreshHandler: {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
} | null = null;

// Register auth handlers (set by AuthProvider)
export const registerAuthHandlers = (login: any, logout: any) => {
  refreshHandler = { login, logout };
};

// Attach token interceptor
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

// Refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
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

          // Update context + SecureStore
          refreshHandler.login(newAccess, newRefresh);
          await SecureStore.setItemAsync("refreshToken", newRefresh);

          // Retry request with new token
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
