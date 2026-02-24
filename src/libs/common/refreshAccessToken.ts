import axios from 'axios';
import { tokenStore } from './tokenStore';

const MAX_REFRESH_RETRIES = 3;
let failCount = 0;
let pendingRefresh: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
    // 동시에 여러 요청이 401을 받아도 갱신 요청은 단 하나만 실행
    if (pendingRefresh) return pendingRefresh;

    if (failCount >= MAX_REFRESH_RETRIES) {
        failCount = 0;
        return Promise.reject(new Error('Max refresh retries exceeded'));
    }

    pendingRefresh = axios
        .post<{ accessToken: string }>(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }, // 리프레시 토큰은 httpOnly 쿠키로 관리
        )
        .then(({ data }) => {
            tokenStore.set(data.accessToken);
            failCount = 0;
            return data.accessToken;
        })
        .catch((error) => {
            failCount++;
            throw error;
        })
        .finally(() => {
            pendingRefresh = null;
        });

    return pendingRefresh;
};
