// ─── Me / 크루 도메인 타입 ─────────────────────────────────────────────────────

export type CrewType = 'PREPARING' | 'MORNING' | 'MIDDLE' | 'AFTERNOON' | 'TEST';
export type CrewRole = 'ADMIN' | 'USER';

/** POST /crews/onboarding 요청 바디 */
export interface OnboardingRequest {
    name: string;
    crewType: CrewType;
}

/** POST /crews/onboarding 성공 응답 */
export interface OnboardingResponse {
    id: number;
    name: string;
    crewType: CrewType;
    email: string;
    role: CrewRole;
    isOnboarded: boolean;
}
