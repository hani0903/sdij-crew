// ─── axios 인스턴스 및 인터셉터 ───────────────────────────────────────────────
//
// 설계 원칙:
//   - Request 인터셉터: authStore에서 accessToken을 읽어 Authorization 헤더 주입.
//   - Response 인터셉터: 401 발생 시 authService.refresh() 호출.
//       - 현재(stub): refresh 즉시 실패 → clearAuth() → /login 리다이렉트.
//       - @future: authService.refresh()가 실제 구현되면 인터셉터 코드 변경 없이 동작.
//
// 변경 이력:
//   - tokenStore, refreshAccessToken → authStore, authService로 교체.
//   - 레거시 파일(tokenStore.ts, refreshAccessToken.ts)은 deprecated 처리됨.

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10_000,
});

// ── Request 인터셉터 ──────────────────────────────────────────────────────────
// authStore에서 accessToken을 직접 읽음.
// Zustand 스토어는 React 외부(모듈 스코프)에서도 .getState()로 접근 가능.

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
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

// ── Response 인터셉터 ─────────────────────────────────────────────────────────

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
                // authService.refresh()를 통해 새 AccessToken을 발급받음.
                //
                // 현재(stub): 즉시 reject → catch 블록으로 이동 → 로그아웃.
                //
                // @future RefreshToken 도입 시:
                //   authService.refresh()가 실제 구현으로 교체되면
                //   이 인터셉터 코드는 변경 없이 자동으로 재시도 흐름이 동작함.
                const { accessToken: newToken } = await authService.refresh();

                // 새 토큰을 스토어에 저장
                useAuthStore.getState().setToken(newToken);

                // 원래 요청을 새 토큰으로 재시도
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch {
                // refresh 실패 → 인증 완전 만료 → 클라이언트 상태 초기화.
                // 리다이렉트는 AuthGuard가 status === 'unauthenticated' 를 감지해 처리.
                // (이 앱은 /login 라우트가 없고 Kakao OAuth를 통해서만 로그인함)
                useAuthStore.getState().clearAuth();
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
