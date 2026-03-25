// ─── 스케줄 배정 편집 모달 ────────────────────────────────────────────────────
//
// 각 교시별 입실/조그/퇴실 담당자 배정과 특별 이벤트(중식세팅/라이브러리배부/삽지)를
// 편집하는 모달 컴포넌트입니다.
//
// 선생님 선택: 교시와 시간이 겹치는 크루원 목록(getCrewByPeriod)을 체크박스 태그로 선택/해제.
// 특별 이벤트: 추가 버튼 → 유형/교시/담당자 지정 후 목록에 표시.

import { useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { getPeriodTime } from '@/utils/getPeriodTime';
import { getCrewByPeriod } from '@/constants/crew';
import { cn } from '@/libs/cn';
import type {
    DayScheduleAssignment,
    PeriodTaskAssignment,
    SpecialEvent,
    SpecialEventType,
} from '@/types/tasks/schedule-task.type';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export interface ScheduleAssignmentModalProps {
    /** 편집 대상 날짜 */
    date: Date;
    /** 현재 저장된 배정 데이터. undefined면 새 배정 생성. */
    assignment: DayScheduleAssignment | undefined;
    /** 저장 버튼 클릭 시 완성된 배정 데이터로 호출 */
    onSave: (assignment: DayScheduleAssignment) => void;
    /** 모달 닫기 콜백 */
    onClose: () => void;
}

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const SPECIAL_EVENT_TYPES: { value: SpecialEventType; label: string }[] = [
    { value: 'LUNCH_SETUP', label: '중식 세팅' },
    { value: 'LIBRARY_DIST', label: '라이브러리 배부' },
    { value: 'HANDOUT', label: '삽지' },
];

const PERIODS = [1, 2, 3, 4, 5, 6];

// ─── 날짜 → YYYY-MM-DD 유틸 ──────────────────────────────────────────────────

function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ─── 선생님 선택 태그 그룹 ────────────────────────────────────────────────────

interface TeacherTagGroupProps {
    /** 선택 가능한 전체 크루원 이름 목록 */
    allTeachers: string[];
    /** 현재 선택된 크루원 이름 목록 */
    selected: string[];
    /** 선택 변경 시 전체 선택 목록을 반환 */
    onChange: (teachers: string[]) => void;
}

/** 클릭으로 선택/해제하는 크루원 태그 그룹 */
function TeacherTagGroup({ allTeachers, selected, onChange }: TeacherTagGroupProps) {
    const toggle = (name: string) => {
        onChange(selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]);
    };

    if (allTeachers.length === 0) {
        return <p className="text-xs text-gray-4">해당 시간대에 근무 중인 크루원이 없습니다.</p>;
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {allTeachers.map((name) => {
                const isSelected = selected.includes(name);
                return (
                    <button
                        key={name}
                        type="button"
                        onClick={() => toggle(name)}
                        className={cn(
                            'rounded-md px-2.5 py-1 font-pretendard text-xs font-medium transition-colors border',
                            isSelected
                                ? 'bg-point text-white border-point'
                                : 'bg-white text-[#475569] border-gray-2 hover:border-point hover:text-point',
                        )}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
}

// ─── 교시 섹션 ────────────────────────────────────────────────────────────────

interface PeriodSectionProps {
    period: number;
    task: PeriodTaskAssignment;
    onChange: (task: PeriodTaskAssignment) => void;
}

/** 단일 교시의 입실/조그/퇴실 배정 편집 섹션 */
function PeriodSection({ period, task, onChange }: PeriodSectionProps) {
    const crewMembers = getCrewByPeriod(period);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-2 p-4 bg-white">
            {/* 교시 헤더 */}
            <div className="flex items-center gap-2">
                <span className="font-pretendard text-sm font-bold text-point">{period}교시</span>
                <span className="font-pretendard text-xs text-[#64748B]">{getPeriodTime(period)}</span>
            </div>

            {/* 입실 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">입실</label>
                <TeacherTagGroup
                    allTeachers={crewMembers}
                    selected={task.entry}
                    onChange={(entry) => onChange({ ...task, entry })}
                />
            </div>

            {/* 조그 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">조그</label>
                <TeacherTagGroup
                    allTeachers={crewMembers}
                    selected={task.jog}
                    onChange={(jog) => onChange({ ...task, jog })}
                />
            </div>

            {/* 퇴실 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">퇴실</label>
                <TeacherTagGroup
                    allTeachers={crewMembers}
                    selected={task.exit}
                    onChange={(exit) => onChange({ ...task, exit })}
                />
            </div>
        </div>
    );
}

// ─── 특별 이벤트 편집 아이템 ──────────────────────────────────────────────────

interface SpecialEventItemProps {
    event: SpecialEvent;
    onChange: (event: SpecialEvent) => void;
    onRemove: (id: string) => void;
}

/** 단일 특별 이벤트 편집 UI */
function SpecialEventItem({ event, onChange, onRemove }: SpecialEventItemProps) {
    const crewMembers = getCrewByPeriod(event.periodNumber);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-2 p-4 bg-gray-1/50">
            {/* 상단: 유형 선택 + 삭제 버튼 */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                    {SPECIAL_EVENT_TYPES.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange({ ...event, type: value })}
                            className={cn(
                                'rounded-md px-2.5 py-1 font-pretendard text-xs font-medium transition-colors border',
                                event.type === value
                                    ? 'bg-[#1F2937] text-white border-[#1F2937]'
                                    : 'bg-white text-[#475569] border-gray-2 hover:border-[#1F2937]',
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(event.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-4 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    삭제
                </button>
            </div>

            {/* 속할 교시 선택 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">교시 선택</label>
                <div className="flex flex-wrap gap-1.5">
                    {PERIODS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onChange({ ...event, periodNumber: p })}
                            className={cn(
                                'rounded-md px-2.5 py-1 font-pretendard text-xs font-medium transition-colors border',
                                event.periodNumber === p
                                    ? 'bg-point text-white border-point'
                                    : 'bg-white text-[#475569] border-gray-2 hover:border-point',
                            )}
                        >
                            {p}교시
                        </button>
                    ))}
                </div>
            </div>

            {/* 담당자 선택 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">담당자</label>
                <TeacherTagGroup
                    allTeachers={crewMembers}
                    selected={event.teachers}
                    onChange={(teachers) => onChange({ ...event, teachers })}
                />
            </div>

            {/* 메모 입력 */}
            <div className="flex flex-col gap-1.5">
                <label className="font-pretendard text-xs font-semibold text-[#1F2937]">메모 (선택)</label>
                <input
                    type="text"
                    value={event.note ?? ''}
                    onChange={(e) => onChange({ ...event, note: e.target.value || undefined })}
                    placeholder="추가 메모를 입력하세요"
                    className="w-full rounded-lg border border-gray-2 px-3 py-2 font-pretendard text-sm text-[#1F2937] placeholder:text-gray-3 focus:border-point focus:outline-none transition-colors"
                />
            </div>
        </div>
    );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function ScheduleAssignmentModal({
    date,
    assignment,
    onSave,
    onClose,
}: ScheduleAssignmentModalProps) {
    const dateString = toLocalDateString(date);

    // ── 교시별 배정 상태 초기화 ──
    const [periodTasks, setPeriodTasks] = useState<PeriodTaskAssignment[]>(() => {
        return PERIODS.map((p) => {
            const existing = assignment?.periodTasks.find((t) => t.periodNumber === p);
            return existing ?? { periodNumber: p, entry: [], jog: [], exit: [] };
        });
    });

    // ── 특별 이벤트 상태 초기화 ──
    const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>(
        () => assignment?.specialEvents ?? [],
    );

    // ── 교시 배정 업데이트 ──
    const handlePeriodChange = useCallback((task: PeriodTaskAssignment) => {
        setPeriodTasks((prev) => prev.map((t) => (t.periodNumber === task.periodNumber ? task : t)));
    }, []);

    // ── 특별 이벤트 추가 ──
    const handleAddEvent = useCallback(() => {
        const newEvent: SpecialEvent = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            periodNumber: 2, // 기본값: 2교시 내
            type: 'LUNCH_SETUP',
            teachers: [],
        };
        setSpecialEvents((prev) => [...prev, newEvent]);
    }, []);

    // ── 특별 이벤트 업데이트 ──
    const handleEventChange = useCallback((event: SpecialEvent) => {
        setSpecialEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    }, []);

    // ── 특별 이벤트 삭제 ──
    const handleEventRemove = useCallback((id: string) => {
        setSpecialEvents((prev) => prev.filter((e) => e.id !== id));
    }, []);

    // ── 저장 ──
    const handleSave = () => {
        const newAssignment: DayScheduleAssignment = {
            date: dateString,
            periodTasks,
            specialEvents,
        };
        onSave(newAssignment);
        onClose();
    };

    return (
        <Modal isOpen title="스케줄 배정 편집" onClose={onClose} size="md">
            <div className="flex flex-col gap-5 p-5">
                {/* ── 교시별 배정 섹션 ── */}
                <section className="flex flex-col gap-3">
                    <h3 className="font-pretendard text-sm font-bold text-[#1F2937]">교시별 배정</h3>
                    {PERIODS.map((period) => {
                        const task = periodTasks.find((t) => t.periodNumber === period)!;
                        return (
                            <PeriodSection
                                key={period}
                                period={period}
                                task={task}
                                onChange={handlePeriodChange}
                            />
                        );
                    })}
                </section>

                {/* ── 특별 이벤트 섹션 ── */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-pretendard text-sm font-bold text-[#1F2937]">특별 이벤트</h3>
                        <button
                            type="button"
                            onClick={handleAddEvent}
                            className="rounded-lg border border-gray-2 px-3 py-1.5 font-pretendard text-xs font-medium text-[#475569] hover:bg-gray-1 transition-colors"
                        >
                            + 이벤트 추가
                        </button>
                    </div>

                    {specialEvents.length === 0 ? (
                        <p className="font-pretendard text-xs text-gray-4 py-2">
                            아직 추가된 특별 이벤트가 없습니다.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {specialEvents.map((event) => (
                                <SpecialEventItem
                                    key={event.id}
                                    event={event}
                                    onChange={handleEventChange}
                                    onRemove={handleEventRemove}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ── 저장 버튼 ── */}
                <div className="flex gap-2 pt-2 pb-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-2 py-3 font-pretendard text-sm font-semibold text-[#475569] hover:bg-gray-1 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 rounded-xl bg-point py-3 font-pretendard text-sm font-semibold text-white hover:bg-point/90 transition-colors"
                    >
                        저장
                    </button>
                </div>
            </div>
        </Modal>
    );
}
