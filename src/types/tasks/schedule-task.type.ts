// ─── 교시 사이 특별 이벤트 유형 ───────────────────────────────────────────────

/** LUNCH_SETUP: 중식 세팅 / LIBRARY_DIST: 라이브러리 배부 / HANDOUT: 삽지 */
export type SpecialEventType = 'LUNCH_SETUP' | 'LIBRARY_DIST' | 'HANDOUT';

// ─── 교시별 태스크 배정 ────────────────────────────────────────────────────────

/** 특정 교시에 입실·조그·퇴실 담당자를 배정하는 단위 */
export interface PeriodTaskAssignment {
    /** 교시 번호 (1~6) */
    periodNumber: number;
    /** 입실 담당자 이름 목록 */
    entry: string[];
    /** 조그 담당자 이름 목록 */
    jog: string[];
    /** 퇴실 담당자 이름 목록 */
    exit: string[];
}

// ─── 교시 내 특별 이벤트 ──────────────────────────────────────────────────────

/** 특정 교시 내에 속하는 특별 업무 이벤트 */
export interface SpecialEvent {
    /** 고유 ID */
    id: string;
    /** 이 이벤트가 속한 교시 번호 (1~6) */
    periodNumber: number;
    /** 이벤트 유형 */
    type: SpecialEventType;
    /** 담당자 이름 목록 */
    teachers: string[];
    /** 추가 메모 (선택) */
    note?: string;
}

// ─── 날짜별 전체 스케줄 배정 ──────────────────────────────────────────────────

/** 특정 날짜의 교시별 배정과 특별 이벤트를 묶는 최상위 단위 */
export interface DayScheduleAssignment {
    /** 날짜 (YYYY-MM-DD) */
    date: string;
    /** 교시별 배정 목록 */
    periodTasks: PeriodTaskAssignment[];
    /** 특별 이벤트 목록 */
    specialEvents: SpecialEvent[];
}
