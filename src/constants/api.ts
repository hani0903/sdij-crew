export const API_ENDPOINTS = {
    CLASS_SESSIONS: {
        BASE: '/class-sessions',
        BULK: '/class-sessions/bulk',
        TODAY: '/class-sessions/today',
        CANCEL: (classSessionId: number) => `/class-sessions/${classSessionId}/cancel`,
        EDIT: (classSessionId: number) => `/class-sessions/${classSessionId}`,
    },
} as const;

export const QUERY_KEYS = {
    CLASS_SESSIONS: {
        ALL: ['class-sessions'] as const,
        BY_DATE: (date: Date) => ['class-sessions', 'date', `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` ] as const,
        TODAY: () => ['class-sessions', 'today'] as const,
    },
} as const;
