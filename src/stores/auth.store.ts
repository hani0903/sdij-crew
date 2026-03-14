// ─── Auth Zustand 스토어 ──────────────────────────────────────────────────────
//
// 책임: accessToken 인메모리 보관 + 인증 상태(status) 추적
//
// 설계 결정:
//   - accessToken은 메모리에만 저장 (XSS 공격으로부터 보호).
//     localStorage/sessionStorage에 저장하면 XSS로 탈취 가능하므로 사용 안 함.
//   - 새로고침 시 token이 날아가는 문제는 RefreshToken 흐름으로 해결 예정.
//     현재는 status === 'idle' 상태에서 refresh 시도 → 실패 시 unauthenticated 전환.
//   - status 머신:
//       idle → (refresh 성공) → authenticated
//       idle → (refresh 실패) → unauthenticated
//       authenticated → (logout / 401) → unauthenticated
//
// @future RefreshToken 도입 시:
//   1. initializeAuth() 함수에서 authService.refresh() 호출
//   2. 성공하면 setToken(), 실패하면 clearAuth() — 이 파일 변경 최소화
//   3. api.ts 인터셉터의 refresh 로직도 authService.refresh()로 대체

import { create } from 'zustand';
import type { AuthStatus } from '@/types/auth/auth.type';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

interface AuthState {
    /** 인메모리 AccessToken. null이면 미인증. */
    accessToken: string | null;
    /** 인증 상태 머신. 초기값 'idle'은 아직 유효성이 확인되지 않은 상태. */
    status: AuthStatus;
}

interface AuthActions {
    /**
     * 로그인 성공 또는 토큰 갱신 성공 시 호출.
     * accessToken을 메모리에 저장하고 status를 'authenticated'로 전환.
     */
    setToken: (token: string) => void;

    /**
     * 로그아웃 또는 401 에러로 인증 만료 시 호출.
     * accessToken을 null로 초기화하고 status를 'unauthenticated'로 전환.
     */
    clearAuth: () => void;

    /**
     * 새로고침 복구 진입점.
     * @future RefreshToken 도입 시 이 함수 내부에서 authService.refresh() 호출.
     * 현재는 즉시 'unauthenticated'로 전환 (RefreshToken 미구현).
     */
    initializeAuth: () => Promise<void>;
}

// ─── 스토어 ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    // ── 초기 상태 ──
    accessToken: null,
    status: 'idle',

    // ── 액션 ──
    setToken: (token) => {
        set({ accessToken: token, status: 'authenticated' });
    },

    clearAuth: () => {
        set({ accessToken: null, status: 'unauthenticated' });
    },

    initializeAuth: async () => {
        // @future RefreshToken 도입 시 아래 주석을 해제하고 실제 구현으로 교체:
        //
        // try {
        //     const { accessToken } = await authService.refresh();
        //     set({ accessToken, status: 'authenticated' });
        // } catch {
        //     set({ accessToken: null, status: 'unauthenticated' });
        // }
        //
        // 현재: RefreshToken 미구현 → 새로고침 시 즉시 로그인 요구.
        set({ accessToken: null, status: 'unauthenticated' });
    },
}));

// ─── 선택자 훅 (구독 범위 최소화로 불필요한 리렌더링 방지) ────────────────────────

/** accessToken만 구독 — 인터셉터 등 토큰 값만 필요한 곳에서 사용 */
export const useAccessToken = () => useAuthStore((s) => s.accessToken);

/** 인증 상태만 구독 — 라우트 가드, 헤더 UI 등에서 사용 */
export const useAuthStatus = () => useAuthStore((s) => s.status);

/** clearAuth 액션만 구독 — 로그아웃 버튼 등에서 사용 */
export const useClearAuth = () => useAuthStore((s) => s.clearAuth);
