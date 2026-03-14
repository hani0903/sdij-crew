import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { teacherService } from '@/services/teacher/teacher.service';
import type { UpdateTeacherParams } from '@/types/teacher/teacher.type';

/** 강사 정보 수정 뮤테이션 훅 — 저장 성공 시 강사 목록 캐시를 자동으로 무효화한다 */
export function useUpdateTeacher() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: number; params: UpdateTeacherParams }) =>
            teacherService.updateTeacher(id, params),
        // 저장 성공 시 강사 전체 목록 캐시를 무효화해 최신 데이터를 다시 불러옴
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEACHERS.ALL });
        },
    });
}
