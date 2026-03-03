import { API_ENDPOINTS } from '@/constants/api';
import type {
    BulkCreateClassSessionsRequest,
    ClassSession,
} from '@/types/schedule/classSession.type';
import api from '@/libs/common/api';

export const classSessionService = {
    /** 특정 날짜의 수업 목록 조회 ('YYYY-MM-DD') */
    async getByDate(date: string): Promise<ClassSession[]> {
        const { data } = await api.get<ClassSession[]>(API_ENDPOINTS.CLASS_SESSIONS.BASE, {
            params: { date },
        });
        return data;
    },

    /** 오늘 수업 목록 조회 */
    async getToday(): Promise<ClassSession[]> {
        const { data } = await api.get<ClassSession[]>(API_ENDPOINTS.CLASS_SESSIONS.TODAY);
        return data;
    },

    /**
     * 주간 수업 일정 일괄 등록
     * - 하나라도 중복이면 서버에서 전체 롤백 (400 CS002)
     * - 존재하지 않는 강의실(404 R001) 또는 교시(404 P001) 포함 시 실패
     */
    async bulkCreate(body: BulkCreateClassSessionsRequest): Promise<ClassSession[]> {
        const { data } = await api.post<ClassSession[]>(
            API_ENDPOINTS.CLASS_SESSIONS.BULK,
            body,
        );
        return data;
    },
} as const;
