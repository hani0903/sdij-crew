// ─── 공통 ───────────────────────────────────────────────────────────────────

export type ClassSessionStatus = 'NORMAL' | 'CANCELLED' | 'MAKEUP';

// ─── Response 타입 ───────────────────────────────────────────────────────────
// 서버가 반환하는 도메인 모델. 여러 서비스·훅·컴포넌트에서 공유되므로 types/ 최상위에 정의.

export interface ClassSession {
    id: number;
    teacherId: number;
    teacherName: string;
    /** 1~6 */
    periodNumber: number;
    roomNumber: number;
    subject: string;
    group: string;
    inPersonCount: number;
    onlineCount: number;
    status: ClassSessionStatus;
    /** 'YYYY-MM-DD' */
    date: string;
}

// ─── Request 타입 ────────────────────────────────────────────────────────────
// 서버로 전송하는 데이터 형태. 동일 도메인 파일에 함께 둬 응집도를 높임.
// 파일이 커지면 classSession.request.type.ts 로 분리 검토.

/** POST /class-sessions/bulk 요청 바디의 단일 수업 항목 */
export interface CreateClassSessionItem {
    teacherName: string;
    periodNumber: number;
    classroomId: number;
    subject: string;
    group: string;
    inPersonCount: number;
    onlineCount: number;
    classStatus: ClassSessionStatus;
    date: string;
}

/** POST /class-sessions/bulk 요청 바디 전체 — 하나라도 중복이면 전체 롤백 */
export interface BulkCreateClassSessionsRequest {
    sessions: CreateClassSessionItem[];
}

/**
 * POST /class-sessions/extract 응답 — 이미지에서 AI가 추출한 수업 데이터.
 *
 * 서버 필드명이 CreateClassSessionItem과 다름에 주의.
 * 매핑 책임은 호출자(TimeTableAddModal.handleExtracted)가 담당.
 *
 * - period: 교시 번호 문자열 (예: "1")
 * - roomName: 강의실 이름 문자열 (예: "601호")
 * - dayOfWeek: 요일 문자열 — 현재 UI에서 미사용 (날짜는 호출자가 부여)
 */
export interface ExtractedClassSession {
    dayOfWeek: string;
    period: string;
    roomName: string;
    teacherName: string;
    /** 수업명 (bulk create 요청의 subject에 대응) */
    className: string;
    /** 반 (bulk create 요청의 group에 대응) */
    classSection: string;
    /** 현강생 수 (bulk create 요청의 inPersonCount에 대응) */
    offlineStudentCount: number;
    /** 인강생 수 (bulk create 요청의 onlineCount에 대응) */
    onlineStudentCount: number;
}
