import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { QUERY_KEYS } from '@/constants/api';
import { teacherService } from '@/services/teacher/teacher.service';

/** debounce 지연 시간 (ms) */
const DEBOUNCE_DELAY = 300;

/**
 * 강사 이름 검색 훅
 *
 * - query가 빈 문자열이면 API 호출을 비활성화 (enabled: false)
 * - 입력 중 불필요한 요청을 막기 위해 300ms debounce 적용
 *
 * [사용 예시]
 * const { data, isLoading, isError } = useTeacherSearch(query);
 */
export function useTeacherSearch(query: string) {
    // ── debounce 처리 ──────────────────────────────────────────────────────
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [query]);

    // ── 쿼리 ──────────────────────────────────────────────────────────────
    return useQuery({
        queryKey: QUERY_KEYS.TEACHERS.SEARCH(debouncedQuery),
        queryFn: () =>
            teacherService.searchTeachers({ name: debouncedQuery }).then((data) => data.teacherSimpleDtoList),
        // 빈 문자열이면 요청하지 않음
        enabled: debouncedQuery.trim().length > 0,
        // 검색 결과는 1분간 캐시 유지
        staleTime: 60 * 1000,
        // 입력 중 이전 결과를 유지하여 깜빡임 방지
        placeholderData: (prev) => prev,
    });
}
