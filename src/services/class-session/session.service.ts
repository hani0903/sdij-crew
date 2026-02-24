import { API_ENDPOINTS } from '@/constants/api';
import type { ClassSession } from '@/types/schedule/classSession.type';
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
} as const;
