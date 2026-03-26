import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { teacherService } from '@/services/teacher/teacher.service';

/**
 * 강사 단건 삭제 mutation 훅
 *
 * [사용 예시]
 * const { mutate, isPending } = useDeleteTeacher();
 * mutate(teacherId);
 */
export function useDeleteTeacher() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (teacherId) => teacherService.deleteTeacher(teacherId),
        // 삭제 성공 시 강사 전체 목록 캐시를 무효화해 최신 데이터를 다시 불러옴
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEACHERS.ALL });
        },
    });
}
