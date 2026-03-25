// ─── 스케줄 배정 Zustand 스토어 ───────────────────────────────────────────────
//
// 책임: 날짜별 교시 태스크 배정(입실/조그/퇴실)과 특별 이벤트를 localStorage에 영속 저장.
//
// 설계 결정:
//   - `assignments`를 날짜 문자열(YYYY-MM-DD) 키의 Record로 관리해 날짜별 O(1) 접근.
//   - persist 미들웨어로 새로고침 후에도 배정 데이터를 유지.
//   - 선택자 훅으로 구독 범위를 최소화해 불필요한 리렌더링을 방지.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayScheduleAssignment, PeriodTaskAssignment, SpecialEvent } from '@/types/tasks/schedule-task.type';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

interface ScheduleAssignmentState {
    /** 날짜(YYYY-MM-DD) → 배정 데이터 맵 */
    assignments: Record<string, DayScheduleAssignment>;
}

interface ScheduleAssignmentActions {
    /**
     * 특정 날짜 전체 배정을 덮어씁니다.
     * 배정 편집 모달의 저장 버튼에서 호출.
     */
    setDayAssignment: (assignment: DayScheduleAssignment) => void;

    /**
     * 특정 날짜의 특정 교시 배정을 업데이트합니다.
     * 이미 날짜 배정이 없는 경우 새로 생성.
     */
    updatePeriodTask: (date: string, task: PeriodTaskAssignment) => void;

    /**
     * 특정 날짜의 특별 이벤트를 추가하거나 업데이트합니다.
     * id가 동일한 이벤트가 있으면 교체(upsert), 없으면 추가.
     */
    upsertSpecialEvent: (date: string, event: SpecialEvent) => void;

    /**
     * 특정 날짜의 특별 이벤트를 id로 삭제합니다.
     */
    removeSpecialEvent: (date: string, eventId: string) => void;
}

// ─── 스토어 ───────────────────────────────────────────────────────────────────

export const useScheduleAssignmentStore = create<ScheduleAssignmentState & ScheduleAssignmentActions>()(
    persist(
        (set) => ({
            // ── 초기 상태 ──
            assignments: {},

            // ── 액션 ──
            setDayAssignment: (assignment) =>
                set((prev) => ({
                    assignments: {
                        ...prev.assignments,
                        [assignment.date]: assignment,
                    },
                })),

            updatePeriodTask: (date, task) =>
                set((prev) => {
                    const existing = prev.assignments[date] ?? {
                        date,
                        periodTasks: [],
                        specialEvents: [],
                    };

                    // 동일 교시 번호가 있으면 교체, 없으면 추가
                    const periodTasks = existing.periodTasks.some((t) => t.periodNumber === task.periodNumber)
                        ? existing.periodTasks.map((t) => (t.periodNumber === task.periodNumber ? task : t))
                        : [...existing.periodTasks, task];

                    return {
                        assignments: {
                            ...prev.assignments,
                            [date]: { ...existing, periodTasks },
                        },
                    };
                }),

            upsertSpecialEvent: (date, event) =>
                set((prev) => {
                    const existing = prev.assignments[date] ?? {
                        date,
                        periodTasks: [],
                        specialEvents: [],
                    };

                    // 동일 id가 있으면 교체, 없으면 추가
                    const specialEvents = existing.specialEvents.some((e) => e.id === event.id)
                        ? existing.specialEvents.map((e) => (e.id === event.id ? event : e))
                        : [...existing.specialEvents, event];

                    return {
                        assignments: {
                            ...prev.assignments,
                            [date]: { ...existing, specialEvents },
                        },
                    };
                }),

            removeSpecialEvent: (date, eventId) =>
                set((prev) => {
                    const existing = prev.assignments[date];
                    if (!existing) return prev;

                    return {
                        assignments: {
                            ...prev.assignments,
                            [date]: {
                                ...existing,
                                specialEvents: existing.specialEvents.filter((e) => e.id !== eventId),
                            },
                        },
                    };
                }),
        }),
        {
            name: 'schedule-assignments', // localStorage 키
        },
    ),
);

// ─── 선택자 훅 (구독 범위 최소화로 불필요한 리렌더링 방지) ────────────────────────

/**
 * 특정 날짜의 배정 데이터를 반환합니다.
 * 배정이 없으면 undefined를 반환.
 */
export function useScheduleAssignment(date: string) {
    return useScheduleAssignmentStore((s) => s.assignments[date]);
}

/** setDayAssignment 액션만 구독 */
export const useSetDayAssignment = () => useScheduleAssignmentStore((s) => s.setDayAssignment);
