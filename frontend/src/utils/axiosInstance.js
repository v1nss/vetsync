import axios from 'axios';
import { getToken, saveToken, getRefreshToken, removeToken, removeRefreshToken } from '../global/utils/token.jsx';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, clear everything and redirect to login
        removeToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        const { token } = response.data;
        saveToken(token);

        // Update the authorization header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Process queued requests
        processQueue(null, token);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        processQueue(refreshError, null);
        removeToken();
        removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

