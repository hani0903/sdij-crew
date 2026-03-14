import { useQuery } from '@tanstack/react-query';
import { classSessionService } from '@/services/class-session/session.service';
import { QUERY_KEYS } from '@/constants/api';

/** Date → 'YYYY-MM-DD' (로컬 시간 기준) */
function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function useFetchClassSessions(date: Date) {
    return useQuery({
        queryKey: QUERY_KEYS.CLASS_SESSIONS.BY_DATE(date),
        queryFn: () =>
            classSessionService.getByDate(toLocalDateString(date)).then((data) => data.classSessionResponses),
        staleTime: 5 * 60 * 1000, // 5분
        placeholderData: (prev) => prev,
    });
}
