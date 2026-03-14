import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { teacherService } from '@/services/teacher/teacher.service';

export function useFetchAllTeachers() {
    return useQuery({
        queryKey: QUERY_KEYS.TEACHERS.ALL,
        queryFn: () => teacherService.fetchAllTeachers().then((data) => data.teacherResponses),
        staleTime: 60 * 1000,
    });
}
