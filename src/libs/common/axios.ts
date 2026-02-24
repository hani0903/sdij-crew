import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

const PUBLIC_URLS = ['/auth/refresh'];

const isPublicUrl = (url?: string) => {
    if (!url) return false;
    return PUBLIC_URLS.some((publicUrl) => url.includes(publicUrl));
};

let refreshTokenPromise: Promise<void> | null = null;

let refreshFailCount = 0;
const MAX_REFRESH_RETRIES = 3;

const refreshAccessToken = async (): Promise<void> => {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }

    // 최대 재시도 횟수 초과 시 즉시 로그아웃
    if (refreshFailCount >= MAX_REFRESH_RETRIES) {
        refreshFailCount = 0;
        throw new Error('Maximum refresh retries exceeded');
    }

    refreshTokenPromise = (async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });

            // 성공 시 카운터 리셋
            refreshFailCount = 0;
        } catch (error) {
            refreshFailCount++;
            throw error;
        } finally {
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
};

// Request Interceptor
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (isPublicUrl(config.url)) {
            return config;
        }

        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(
                `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.status,
            );
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // 401 에러 처리
        if (error.response?.status === 401 && !originalRequest._retry && !isPublicUrl(originalRequest.url)) {
            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                return api(originalRequest);
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('auth:token-expired'));

                    // 현재 경로 저장 (로그인 후 돌아오기 위해)
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        if (import.meta.env.DEV) {
            console.error(`[API Error] ${error.response?.status}`, error.message);
        }

        return Promise.reject(error);
    },
);

export default api;
