import type { CrewShift } from '@/types/crew/crew.type';

// ─── 크루 근무 시프트 ─────────────────────────────────────────────────────────

export const CREW_SHIFTS: CrewShift[] = [
    { start: '07:00', end: '15:00', members: ['지효', '지혜', '한솔'] },
    { start: '07:30', end: '15:30', members: ['도연', '유철', '진형', '지민', '은진'] },
    { start: '09:00', end: '17:00', members: ['혜령', '승찬'] },
    { start: '14:30', end: '22:30', members: ['소연', '명원', '지원', '창윤'] },
];

// ─── 교시별 시간 범위 ─────────────────────────────────────────────────────────
// IMPORTANT: getPeriodTime.ts와 동기화되어야 합니다.
// getPeriodTime.ts를 수정할 경우 이 상수도 함께 갱신하세요.

const PERIOD_RANGES: Record<number, { start: string; end: string }> = {
    1: { start: '08:30', end: '10:10' },
    2: { start: '10:30', end: '12:10' },
    3: { start: '13:20', end: '15:00' },
    4: { start: '15:20', end: '17:00' },
    5: { start: '18:20', end: '20:00' },
    6: { start: '20:20', end: '22:00' },
};

// ─── 유틸: "HH:MM" → 분 단위 숫자 변환 ──────────────────────────────────────

function toMinutes(time: string): number {
    const [hStr, mStr] = time.split(':');
    return Number(hStr) * 60 + Number(mStr);
}

// ─── 교시별 근무 크루원 조회 ──────────────────────────────────────────────────

/**
 * 주어진 교시와 시간대가 1분이라도 겹치는 크루원 목록을 반환합니다.
 * 겹침 조건: shiftStart < periodEnd && shiftEnd > periodStart (분 단위 비교)
 *
 * @param periodNumber 교시 번호 (1~6)
 * @returns 해당 교시에 근무 중인 크루원 이름 배열
 */
export function getCrewByPeriod(periodNumber: number): string[] {
    const range = PERIOD_RANGES[periodNumber];
    if (!range) return [];

    const periodStart = toMinutes(range.start);
    const periodEnd = toMinutes(range.end);

    return CREW_SHIFTS.filter((shift) => {
        const shiftStart = toMinutes(shift.start);
        const shiftEnd = toMinutes(shift.end);
        return shiftStart < periodEnd && shiftEnd > periodStart;
    }).flatMap((shift) => shift.members);
}
