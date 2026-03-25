/** 크루 근무 시프트 — 동일 시간대에 일하는 크루원 그룹 */
export interface CrewShift {
    /** 근무 시작 시간 "HH:MM" */
    start: string;
    /** 근무 종료 시간 "HH:MM" */
    end: string;
    /** 이 시프트에 속한 크루원 이름 목록 */
    members: string[];
}
