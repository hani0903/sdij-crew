export interface TeacherSetting {
    id: number;
    name: string;
    chalkType: 'ACADEMY' | 'MIXED' | 'PERSONAL';
    chalkDetail: string;
    eraserDetail?: string;
    micType: 'ACADEMY' | 'PERSONAL';
    hasPpt: boolean;
    notes?: string;
    email?: string;
}

// ─── 강사 검색 도메인 타입 ──────────────────────────────────────────────────

/** GET /api/teachers/search 요청 파라미터 */
export interface TeacherSearchParams {
    /** 검색할 강사 이름 (부분 일치) */
    name: string;
}

/** 강사 검색 결과 단건 */
export interface Teacher {
    /** 강사 고유 ID */
    id: number;
    /** 강사 이름 */
    name: string;
}

/** GET /api/teachers/search 응답 타입 */
export type TeacherSearchResponse = { teacherSimpleDtoList: Teacher[] };

export type FetchAllTeachersResponse = { teacherResponses: TeacherSetting[] };

/** PUT /api/teachers/:id 요청 본문 */
export interface UpdateTeacherParams {
    name: string;
    chalkType: 'ACADEMY' | 'MIXED' | 'PERSONAL';
    chalkDetail: string;
    eraserDetail?: string;
    micType: 'ACADEMY' | 'PERSONAL';
    hasPpt: boolean;
    /** null을 명시적으로 전달해 서버 측 필드를 초기화할 수 있도록 허용 */
    notes?: string | null;
    email?: string;
}
