// ─── @deprecated ─────────────────────────────────────────────────────────────
//
// 이 파일은 더 이상 사용되지 않습니다.
// AccessToken 재발급 로직은 두 곳으로 분리되었습니다:
//
//   1. src/services/auth/auth.service.ts → authService.refresh()
//      (HTTP 통신 담당. RefreshToken 도입 시 이 함수만 수정)
//
//   2. src/libs/common/api.ts → Response 인터셉터
//      (401 감지 → authService.refresh() 호출 → 재시도 흐름)
//
// 이 파일은 레거시 코드와의 호환성을 위해 잠시 유지되며,
// 모든 참조가 제거되면 삭제합니다.

/** @deprecated src/services/auth/auth.service.ts의 authService.refresh()를 사용하세요 */
export const refreshAccessToken = (): Promise<string> => {
    console.warn(
        '[deprecated] refreshAccessToken()은 더 이상 사용되지 않습니다. ' +
        'authService.refresh()를 사용하세요.',
    );
    return Promise.reject(new Error('[deprecated] refreshAccessToken — authService.refresh()로 대체됨'));
};
