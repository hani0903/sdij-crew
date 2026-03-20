import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { teacherService } from '@/services/teacher/teacher.service';
import type { CreateTeacherParams } from '@/types/teacher/teacher.type';

/** 강사 신규 생성 뮤테이션 훅 — 생성 성공 시 강사 목록 캐시를 자동으로 무효화한다 */
export function useCreateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateTeacherParams) => teacherService.createTeacher(params),
        // 생성 성공 시 강사 전체 목록 캐시를 무효화해 최신 데이터를 다시 불러옴
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEACHERS.ALL });
        },
    });
}
