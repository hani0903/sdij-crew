import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';
import { refreshAccessToken } from './refreshAccessToken';
import { redirectToLogin } from './utils/redirectToLogin';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10_000,
});

// ── Request ──────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = tokenStore.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (import.meta.env.DEV) {
            console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (e) => Promise.reject(e),
);

// ── Response ─────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(`← ${response.status} ${response.config.url}`);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;
        const is401 = error.response?.status === 401;

        if (is401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch {
                tokenStore.clear();
                redirectToLogin();
                return Promise.reject(error);
            }
        }

        if (import.meta.env.DEV) {
            console.error(`✕ ${error.response?.status} ${error.config?.url}`, error.message);
        }

        return Promise.reject(error);
    },
);

export default api;