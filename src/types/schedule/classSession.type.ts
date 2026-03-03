// ─── 공통 ───────────────────────────────────────────────────────────────────

export type ClassSessionStatus = 'NORMAL' | 'CANCELLED' | 'MAKEUP';

// ─── Response 타입 ───────────────────────────────────────────────────────────
// 서버가 반환하는 도메인 모델. 여러 서비스·훅·컴포넌트에서 공유되므로 types/ 최상위에 정의.

export interface ClassSession {
    teacherId: number;
    /** 1~6 */
    periodNumber: number;
    /** 예: 602 */
    classroomId: number;
    subject: string;
    group: string;
    inPersonCount: number;
    onlineCount: number;
    classStatus: ClassSessionStatus;
    /** 'YYYY-MM-DD' */
    date: string;
}

// ─── Request 타입 ────────────────────────────────────────────────────────────
// 서버로 전송하는 데이터 형태. 동일 도메인 파일에 함께 둬 응집도를 높임.
// 파일이 커지면 classSession.request.type.ts 로 분리 검토.

/** POST /class-sessions/bulk 요청 바디의 단일 수업 항목 */
export interface CreateClassSessionItem {
    teacherId: number;
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
