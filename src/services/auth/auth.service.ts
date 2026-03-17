// ─── Auth 서비스 레이어 ───────────────────────────────────────────────────────
//
// 책임: 인증 관련 HTTP 통신만 담당. UI·상태 관리와 완전히 분리.
//
// 의존성 방향: services/ → types/ (단방향. stores/, hooks/ 에 의존하지 않음)
//
// 사용 방법:
//   컴포넌트나 라우트에서 직접 호출하지 않고, 반드시 hooks/queries/auth/ 훅을 통해 사용.
//
// @future RefreshToken 도입 체크리스트:
//   1. refresh() 함수의 주석 제거 후 실제 구현 활성화
//   2. httpOnly cookie 방식: withCredentials: true 이미 설정되어 있음 → 추가 작업 없음
//   3. response body 방식: 반환 타입에 refreshToken 추가 (LoginResponse 타입 수정)
//   4. api.ts 인터셉터의 refreshAccessToken import를 authService.refresh로 교체

import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { KakaoCallbackRequest, LoginResponse } from '@/types/auth/auth.type';

// ─── refresh 전용 axios 인스턴스 ─────────────────────────────────────────────
// refresh 요청은 인터셉터가 부착된 api 인스턴스를 통과하면 안 됨.
// (401 → refresh → 401 → refresh → 무한 루프 방지)
// withCredentials: true → RefreshToken httpOnly cookie를 주고받기 위해 필요.
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10_000,
    withCredentials: true,
});

// ─── Auth 서비스 ──────────────────────────────────────────────────────────────

export const authService = {
    /**
     * 카카오 OAuth 인가 코드 → AccessToken 교환.
     *
     * 흐름: 카카오 인가 서버 → redirect_uri(?code=xxx) → 이 함수 → 백엔드 → AccessToken
     *
     * - 서버가 code, dest를 query string으로 받으므로 body가 아닌 params로 전달
     * - 쿠키가 필요 없는 공개 엔드포인트이므로 publicClient 사용 (withCredentials: false)
     */
    kakaoCallback: (params: KakaoCallbackRequest): Promise<LoginResponse> =>
        // withCredentials: true → 서버가 Set-Cookie로 내려주는 RefreshToken httpOnly cookie를 브라우저가 저장함.
        // publicClient(withCredentials: false)를 쓰면 Set-Cookie 헤더가 무시되므로 refreshClient 사용.
        axiosClient.post<LoginResponse>(API_ENDPOINTS.AUTH.KAKAO_CALLBACK, undefined, { params }).then((r) => r.data),

    /**
     * 로그아웃.
     * 서버에서 RefreshToken(httpOnly cookie) 또는 세션을 무효화.
     * 네트워크 오류가 발생해도 클라이언트 상태는 반드시 초기화해야 하므로,
     * 이 함수 호출 후 authStore.clearAuth()를 항상 실행할 것.
     */
    logout: (): Promise<void> => axiosClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT).then(() => undefined),

    /**
     * AccessToken 재발급.
     *
     * 현재 미구현 — RefreshToken 도입 시 이 함수만 수정하면 됨.
     *
     * @future 구현 방향:
     *   - httpOnly cookie 방식: refreshClient.post(REFRESH) → { accessToken } 반환
     *   - response body 방식: refreshClient.post(REFRESH, { refreshToken }) → { accessToken } 반환
     *
     * @throws {Error} 항상 실패 (현재 stub)
     */
    refresh: (): Promise<LoginResponse> =>
        // httpOnly cookie의 RefreshToken은 브라우저가 자동으로 요청에 첨부함 (withCredentials: true).
        axiosClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH).then((r) => r.data),
} as const;
