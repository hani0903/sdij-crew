// ─── 전체 스케줄 표 컴포넌트 ──────────────────────────────────────────────────
//
// 교시별 입실/조그/퇴실 담당자와 교시 내 특별 이벤트를 테이블로 표시합니다.
// 특별 이벤트는 해당 교시 셀에 rowspan으로 묶여 교시 내에 속하는 것으로 표시됩니다.
// 기존 Timetable 컴포넌트의 스타일(border-y border-gray-2 등)과 일관성을 유지합니다.

import { Fragment } from 'react';
import { getPeriodTime } from '@/utils/getPeriodTime';
import { cn } from '@/libs/cn';
import type { DayScheduleAssignment, SpecialEventType } from '@/types/tasks/schedule-task.type';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export interface FullScheduleTableProps {
    /** 날짜별 배정 데이터. undefined면 빈 상태 UI를 표시. */
    assignment: DayScheduleAssignment | undefined;
    /** 표시할 교시 번호 목록 (예: [1, 2, 3, 4, 5, 6]) */
    periods: number[];
    /** "배정 편집" 버튼 클릭 시 호출되는 콜백 */
    onEdit: () => void;
}

// ─── 상수 ─────────────────────────────────────────────────────────────────────

/** 특별 이벤트 유형별 한국어 레이블 */
const SPECIAL_EVENT_LABEL: Record<SpecialEventType, string> = {
    LUNCH_SETUP: '중식 세팅',
    LIBRARY_DIST: '라이브러리 배부',
    HANDOUT: '삽지',
};

/** 특별 이벤트 유형별 행 배경 색상 */
const SPECIAL_EVENT_BG: Record<SpecialEventType, string> = {
    LUNCH_SETUP: 'bg-amber-50',
    LIBRARY_DIST: 'bg-blue-50',
    HANDOUT: 'bg-green-50',
};

/** 특별 이벤트 유형별 텍스트 색상 */
const SPECIAL_EVENT_TEXT: Record<SpecialEventType, string> = {
    LUNCH_SETUP: 'text-amber-700',
    LIBRARY_DIST: 'text-blue-700',
    HANDOUT: 'text-green-700',
};

/** 특별 이벤트 유형별 배지 배경 색상 */
const SPECIAL_EVENT_BADGE_BG: Record<SpecialEventType, string> = {
    LUNCH_SETUP: 'bg-amber-100',
    LIBRARY_DIST: 'bg-blue-100',
    HANDOUT: 'bg-green-100',
};

// ─── 담당자 배지 ──────────────────────────────────────────────────────────────

/** 담당자 이름을 배지로 표시하는 서브 컴포넌트 */
function TeacherBadge({ name }: { name: string }) {
    return (
        <span className="inline-block rounded-md bg-point/10 px-2 py-0.5 font-pretendard text-xs font-medium text-point">
            {name}
        </span>
    );
}

// ─── 역할 셀 ──────────────────────────────────────────────────────────────────

/** 교시 역할 셀 (입실/조그/퇴실). 배정 없으면 "—" 표시 */
function RoleCell({ teachers, isLast = false, noBorderBottom = false }: { teachers: string[]; isLast?: boolean; noBorderBottom?: boolean }) {
    return (
        <td
            className={cn(
                'border-b border-r border-gray-2 px-3 py-3 align-top min-w-[80px]',
                isLast && 'border-r-0',
                noBorderBottom && 'border-b-0',
            )}
        >
            {teachers.length === 0 ? (
                <span className="text-gray-2 font-pretendard text-sm">—</span>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {teachers.map((name) => (
                        <TeacherBadge key={name} name={name} />
                    ))}
                </div>
            )}
        </td>
    );
}

// ─── 특별 이벤트 행 ────────────────────────────────────────────────────────────

interface SpecialEventRowProps {
    type: SpecialEventType;
    teachers: string[];
    note?: string;
    /** 마지막 행이면 border-b 제거 */
    isLastRow?: boolean;
}

/** 교시 내 특별 이벤트를 3 colspan으로 표시하는 행 (교시 셀은 rowspan으로 위 행이 차지) */
function SpecialEventRow({ type, teachers, note, isLastRow = false }: SpecialEventRowProps) {
    return (
        <tr>
            <td
                colSpan={3}
                className={cn('border-b border-gray-2 px-4 py-2', SPECIAL_EVENT_BG[type], isLastRow && 'border-b-0')}
            >
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={cn(
                            'inline-block rounded-md px-2 py-0.5 font-pretendard text-xs font-semibold',
                            SPECIAL_EVENT_BADGE_BG[type],
                            SPECIAL_EVENT_TEXT[type],
                        )}
                    >
                        {SPECIAL_EVENT_LABEL[type]}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {teachers.map((name) => (
                            <span
                                key={name}
                                className={cn('font-pretendard text-xs font-medium', SPECIAL_EVENT_TEXT[type])}
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                    {note && <span className="font-pretendard text-xs text-gray-4 ml-auto">{note}</span>}
                </div>
            </td>
        </tr>
    );
}

// ─── 빈 상태 UI ───────────────────────────────────────────────────────────────

function EmptyState({ onEdit }: { onEdit: () => void }) {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="font-pretendard text-sm text-gray-4">아직 배정된 스케줄이 없습니다.</p>
            <button
                type="button"
                onClick={onEdit}
                className="rounded-lg bg-point px-4 py-2 font-pretendard text-sm font-semibold text-white hover:bg-point/90 transition-colors"
            >
                배정 시작
            </button>
        </div>
    );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function FullScheduleTable({ assignment, periods, onEdit }: FullScheduleTableProps) {
    // 배정 없으면 빈 상태 UI 표시
    if (!assignment) {
        return <EmptyState onEdit={onEdit} />;
    }

    // 교시 번호 → 배정 맵 (O(1) 접근)
    const taskMap = new Map(assignment.periodTasks.map((t) => [t.periodNumber, t]));

    // 교시 번호 → 해당 교시 내 특별 이벤트 맵
    const eventsByPeriod = new Map<number, typeof assignment.specialEvents>();
    for (const event of assignment.specialEvents) {
        const list = eventsByPeriod.get(event.periodNumber) ?? [];
        eventsByPeriod.set(event.periodNumber, [...list, event]);
    }

    // 마지막 교시 번호 (border-b 제거 기준)
    const lastPeriod = periods[periods.length - 1];

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left border-y border-gray-2">
                {/* ── 헤더 ── */}
                <thead>
                    <tr>
                        <th className="w-20 border-b border-r border-gray-2 bg-gray-1 px-3 py-3 font-pretendard text-sm font-semibold text-[#475569]">
                            교시
                        </th>
                        <th className="border-b border-r border-gray-2 bg-gray-1 px-3 py-3 font-pretendard text-sm font-semibold text-[#475569]">
                            입실
                        </th>
                        <th className="border-b border-r border-gray-2 bg-gray-1 px-3 py-3 font-pretendard text-sm font-semibold text-[#475569]">
                            조그
                        </th>
                        <th className="border-b border-gray-2 bg-gray-1 px-3 py-3 font-pretendard text-sm font-semibold text-[#475569]">
                            퇴실
                        </th>
                    </tr>
                </thead>

                {/* ── 본문 ── */}
                <tbody>
                    {periods.map((period) => {
                        const task = taskMap.get(period);
                        const eventsInPeriod = eventsByPeriod.get(period) ?? [];
                        const isLast = period === lastPeriod;

                        /*
                          특별 이벤트가 있으면 교시 헤더 셀에 rowspan을 적용한다.
                          rowspan = 1(메인 행) + 특별 이벤트 수
                          → 교시 셀이 여러 행에 걸쳐 표시되며, 특별 이벤트 행은
                            교시 열을 포함하지 않고 나머지 3열만 사용(colSpan=3).
                        */
                        const rowSpan = 1 + eventsInPeriod.length;

                        return (
                            <Fragment key={`period-group-${period}`}>
                                {/* ─ 메인 행: 교시 헤더 + 입실/조그/퇴실 ─ */}
                                <tr>
                                    <td
                                        rowSpan={rowSpan}
                                        className={cn(
                                            'border-r border-gray-2 bg-white px-3 py-4 text-center font-pretendard text-sm font-medium text-gray-4 align-top',
                                            // 특별 이벤트가 없는 마지막 교시에만 border-b 적용
                                            isLast && eventsInPeriod.length === 0 ? '' : 'border-b border-gray-2',
                                        )}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-nowrap font-bold text-sm text-point">
                                                {period}교시
                                            </span>
                                            <span className="text-xs text-[#64748B]">
                                                {getPeriodTime(period)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* 특별 이벤트가 없으면 메인 행이 마지막 행 → border-b 제거 */}
                                    <RoleCell
                                        teachers={task?.entry ?? []}
                                        noBorderBottom={isLast && eventsInPeriod.length === 0}
                                    />
                                    <RoleCell
                                        teachers={task?.jog ?? []}
                                        noBorderBottom={isLast && eventsInPeriod.length === 0}
                                    />
                                    <RoleCell
                                        teachers={task?.exit ?? []}
                                        isLast
                                        noBorderBottom={isLast && eventsInPeriod.length === 0}
                                    />
                                </tr>

                                {/* ─ 특별 이벤트 서브 행들 (교시 셀 없음 — rowspan으로 위 행이 차지) ─ */}
                                {eventsInPeriod.map((event, idx) => (
                                    <SpecialEventRow
                                        key={event.id}
                                        type={event.type}
                                        teachers={event.teachers}
                                        note={event.note}
                                        isLastRow={isLast && idx === eventsInPeriod.length - 1}
                                    />
                                ))}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
