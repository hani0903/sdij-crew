import { API_ENDPOINTS } from '@/constants/api';
import type {
    BulkCreateClassSessionsRequest,
    ClassSession,
    ExtractedClassSession,
} from '@/types/schedule/classSession.type';
import api from '@/libs/common/api';

type getClassSessionsResponse = { classSessionResponses: ClassSession[] };

export const classSessionService = {
    /** 특정 날짜의 수업 목록 조회 ('YYYY-MM-DD') */
    async getByDate(date: string): Promise<getClassSessionsResponse> {
        const { data } = await api.get<getClassSessionsResponse>(API_ENDPOINTS.CLASS_SESSIONS.BASE, {
            params: { date },
        });
        return data;
    },

    /** 오늘 수업 목록 조회 */
    async getToday(): Promise<getClassSessionsResponse> {
        const { data } = await api.get<getClassSessionsResponse>(API_ENDPOINTS.CLASS_SESSIONS.TODAY);
        return data;
    },

    /**
     * 주간 수업 일정 일괄 등록
     * - 하나라도 중복이면 서버에서 전체 롤백 (400 CS002)
     * - 존재하지 않는 강의실(404 R001) 또는 교시(404 P001) 포함 시 실패
     */
    async bulkCreate(body: BulkCreateClassSessionsRequest): Promise<ClassSession[]> {
        const { data } = await api.post<ClassSession[]>(API_ENDPOINTS.CLASS_SESSIONS.BULK, body);
        return data;
    },

    /**
     * 수업 일정 단건 삭제
     * DELETE /api/v1/class-sessions/:classSessionId
     */
    async deleteClassSession(classSessionId: number): Promise<void> {
        await api.delete(API_ENDPOINTS.CLASS_SESSIONS.EDIT(classSessionId));
    },

    /**
     * 이미지에서 수업 데이터 AI 추출.
     * - multipart/form-data 로 파일 전송, Content-Type 헤더는 axios가 자동 설정.
     * - AI 처리 특성상 응답이 오래 걸리므로 timeout을 60초로 개별 override.
     * - date는 포함되지 않음 — 호출자가 선택된 날짜를 붙여 사용.
     */
    async extractFromImage(file: File): Promise<ExtractedClassSession[]> {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<ExtractedClassSession[]>(
            API_ENDPOINTS.CLASS_SESSIONS.EXTRACT,
            formData,
            { timeout: 60_000 },
        );
        return data;
    },
} as const;
