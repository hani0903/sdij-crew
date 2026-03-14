// ─── @deprecated ─────────────────────────────────────────────────────────────
//
// 이 파일은 더 이상 사용되지 않습니다.
// AccessToken 관리는 src/stores/auth.store.ts (Zustand)가 담당합니다.
//
// 마이그레이션 가이드:
//   Before: tokenStore.get()           → After: useAuthStore.getState().accessToken
//   Before: tokenStore.set(token)      → After: useAuthStore.getState().setToken(token)
//   Before: tokenStore.clear()         → After: useAuthStore.getState().clearAuth()
//
// 이 파일은 레거시 코드와의 호환성을 위해 잠시 유지되며,
// 모든 참조가 제거되면 삭제합니다.

/** @deprecated src/stores/auth.store.ts의 useAuthStore를 사용하세요 */
export const tokenStore = {
    /** @deprecated useAuthStore.getState().accessToken */
    get: () => null as string | null,
    /** @deprecated useAuthStore.getState().setToken(token) */
    set: (_token: string) => { /* no-op */ },
    /** @deprecated useAuthStore.getState().clearAuth() */
    clear: () => { /* no-op */ },
};
