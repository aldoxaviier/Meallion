import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

const apiFastApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_FASTAPI_URL,
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


apiFastApi.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = tokenGetter?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = tokenGetter?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 ) {
      originalRequest._retry = true;
      console.log("here");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken && refreshHandler) {
        try {
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccess = res.data.data.accessToken;

          refreshHandler.login(newAccess, refreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          console.log("Retrying original request with new access token");
          return api(originalRequest);
        } catch (err) {
          refreshHandler.logout();
        }
      }
    }

    return Promise.reject(error);
  }
);

apiFastApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 ) {
      originalRequest._retry = true;
      console.log("here");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken && refreshHandler) {
        try {
          const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccess = res.data.data.accessToken;

          refreshHandler.login(newAccess, refreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          console.log("Retrying original request with new access token");
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

// Add auth interceptor for FastAPI instance
apiFastApi.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = tokenGetter?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiFastApi.defaults.headers.common["Content-Type"] = "application/json";

export { apiFastApi, api };
