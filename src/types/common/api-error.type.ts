// ─── 공통 API 에러 구조 ───────────────────────────────────────────────────────
// 여러 도메인에서 공유하는 에러 형태 → types/common/ 에 격리.
// 도메인별 에러 코드는 const 객체로 선언해 런타임 비교와 타입 추론을 동시에 지원.

/** 서버 에러 응답 공통 구조 */
export interface ApiErrorResponse<TCode extends string = string> {
    error: TCode;
    message: string;
}

// ─── 에러 코드 상수 ──────────────────────────────────────────────────────────
// enum 대신 const 객체 사용 이유:
//   1) 런타임에 값으로 접근 가능 (error.code === CLASS_SESSION_ERROR_CODES.DUPLICATE)
//   2) TypeScript가 값에서 타입을 추론하므로 별도 타입 선언 불필요
//   3) 트리쉐이킹 친화적

/** 수업 일정 도메인 에러 코드 */
export const CLASS_SESSION_ERROR_CODES = {
    /** 중복된 수업 일정 포함 → 전체 롤백 */
    DUPLICATE: 'CS002',
} as const;

/** 리소스(강의실·교시) 에러 코드 */
export const RESOURCE_ERROR_CODES = {
    /** 존재하지 않는 강의실 */
    CLASSROOM_NOT_FOUND: 'R001',
    /** 존재하지 않는 교시 */
    PERIOD_NOT_FOUND: 'P001',
} as const;

/** 인증 에러 코드 */
export const AUTH_ERROR_CODES = {
    UNAUTHORIZED: 'A002',
} as const;

/** 크루(사용자) 도메인 에러 코드 */
export const CREW_ERROR_CODES = {
    /** 이미 온보딩 완료된 크루 → 클라이언트 상태 동기화 후 토스트 안내 */
    ALREADY_ONBOARDED: 'C005',
} as const;

// ─── 에러 코드 타입 ──────────────────────────────────────────────────────────

export type ClassSessionErrorCode =
    (typeof CLASS_SESSION_ERROR_CODES)[keyof typeof CLASS_SESSION_ERROR_CODES];

export type ResourceErrorCode =
    (typeof RESOURCE_ERROR_CODES)[keyof typeof RESOURCE_ERROR_CODES];

export type AuthErrorCode =
    (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export type CrewErrorCode = (typeof CREW_ERROR_CODES)[keyof typeof CREW_ERROR_CODES];

/** 앱 전체 에러 코드 유니온 */
export type AppErrorCode = ClassSessionErrorCode | ResourceErrorCode | AuthErrorCode | CrewErrorCode;
