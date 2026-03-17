export const API_ENDPOINTS = {
    ME: {
        /** POST /my/onboarding — 최초 로그인 후 이름·근무반 등록 */
        ONBOARDING: '/my/onboarding',
    },
    // ─── 인증 ────────────────────────────────────────────────────────────────
    AUTH: {
        /** POST /oauth/kakao — 카카오 인가 코드 → AccessToken 교환 */
        KAKAO_CALLBACK: '/oauth/kakao',
        /** POST /auth/logout — 서버 세션/RefreshToken 무효화 */
        LOGOUT: '/auth/logout',
        /**
         * POST /auth/refresh — AccessToken 재발급
         * @future RefreshToken 도입 시 실제 엔드포인트로 교체
         */
        REFRESH: '/auth/refresh',
    },
    CLASS_SESSIONS: {
        BASE: '/class-sessions',
        BULK: '/class-sessions/bulk',
        TODAY: '/class-sessions/today',
        CANCEL: (classSessionId: number) => `/class-sessions/${classSessionId}/cancel`,
        EDIT: (classSessionId: number) => `/class-sessions/${classSessionId}`,
    },
    TEACHERS: {
        ALL: '/teachers',
        /** GET /api/teachers/search?query=검색어 */
        SEARCH: '/teachers/search',
        /** PUT /api/teachers/:id — 강사 정보 수정 */
        UPDATE: (id: number) => `/teachers/${id}`,
    },
} as const;

export const QUERY_KEYS = {
    CLASS_SESSIONS: {
        ALL: ['class-sessions'] as const,
        BY_DATE: (date: Date) =>
            [
                'class-sessions',
                'date',
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            ] as const,
        TODAY: () => ['class-sessions', 'today'] as const,
    },
    TEACHERS: {
        ALL: ['teachers'] as const,
        /** 이름 검색 결과 — query가 바뀌면 별도 캐시 항목으로 관리 */
        SEARCH: (query: string) => ['teachers', 'search', query] as const,
    },
} as const;
