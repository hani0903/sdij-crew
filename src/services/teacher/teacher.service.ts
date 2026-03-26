import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/api';
import type {
    CreateTeacherParams,
    FetchAllTeachersResponse,
    TeacherSearchParams,
    TeacherSearchResponse,
    TeacherSetting,
    UpdateTeacherParams,
} from '@/types/teacher/teacher.type';

export const teacherService = {
    /**
     * 강사 전체 조회
     * GET /api/teachers
     */
    async fetchAllTeachers(): Promise<FetchAllTeachersResponse> {
        const { data } = await api.get<FetchAllTeachersResponse>(API_ENDPOINTS.TEACHERS.ALL);
        return data;
    },
    /**
     * 강사 이름 검색
     * GET /api/teachers/search?query=검색어
     * - 빈 문자열 전달 금지 (훅 레이어에서 enabled 조건으로 보장)
     */
    async searchTeachers(params: TeacherSearchParams): Promise<TeacherSearchResponse> {
        const { data } = await api.get<TeacherSearchResponse>(API_ENDPOINTS.TEACHERS.SEARCH, {
            params,
        });
        return data;
    },
    /**
     * 강사 신규 생성
     * POST /api/v1/teachers
     */
    async createTeacher(params: CreateTeacherParams): Promise<TeacherSetting> {
        const { data } = await api.post<TeacherSetting>(API_ENDPOINTS.TEACHERS.ALL, params);
        return data;
    },
    /**
     * 강사 정보 수정
     * PUT /api/teachers/:id
     */
    async updateTeacher(id: number, params: UpdateTeacherParams): Promise<TeacherSetting> {
        const { data } = await api.put<TeacherSetting>(API_ENDPOINTS.TEACHERS.UPDATE(id), params);
        return data;
    },
    /**
     * 강사 삭제
     * DELETE /api/teachers/:id
     */
    async deleteTeacher(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.TEACHERS.DELETE(id));
    },
} as const;
