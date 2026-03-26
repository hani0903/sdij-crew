import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { classSessionService } from '@/services/class-session/session.service';

/**
 * 수업 일정 단건 삭제 mutation 훅
 *
 * [사용 예시]
 * const { mutate, isPending } = useDeleteClassSession();
 * mutate(classSessionId);
 */
export function useDeleteClassSession() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (classSessionId) => classSessionService.deleteClassSession(classSessionId),

        // 삭제 성공 시 수업 일정 전체 캐시를 무효화해 최신 데이터를 다시 불러옴
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CLASS_SESSIONS.ALL,
            });
        },
    });
}
