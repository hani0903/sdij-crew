import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants/api';
import { classSessionService } from '@/services/class-session/session.service';
import type { BulkCreateClassSessionsRequest, ClassSession } from '@/types/schedule/classSession.type';
import type { ApiErrorResponse, ClassSessionErrorCode, ResourceErrorCode } from '@/types/common/api-error.type';

// POST /class-sessions/bulk 에서 발생 가능한 에러 응답 타입
type BulkCreateError = AxiosError<ApiErrorResponse<ClassSessionErrorCode | ResourceErrorCode>>;

/**
 * 주간 수업 일정 일괄 등록 mutation 훅
 *
 * [사용 예시]
 * const { mutate, isPending, error } = useCreateClassSessions();
 * mutate({ sessions: [...] });
 *
 * [에러 처리]
 * error?.response?.data.error === CLASS_SESSION_ERROR_CODES.DUPLICATE
 */
export function useCreateClassSessions() {
    const queryClient = useQueryClient();

    return useMutation<ClassSession[], BulkCreateError, BulkCreateClassSessionsRequest>({
        mutationFn: (body) => classSessionService.bulkCreate(body),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CLASS_SESSIONS.ALL,
            });
        },
    });
}
