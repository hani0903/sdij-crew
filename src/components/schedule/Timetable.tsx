import { useState } from 'react';
import { getPeriodTime } from '../../utils/getPeriodTime';

export type ClassStatus = 'normal' | 'cancelled' | 'makeup';

export interface ClassEntry {
    /** 교시 (예: '1교시'). periods 배열의 값과 일치해야 함 */
    period: string;
    /** 교실 (예: '601호'). classrooms 배열의 값과 일치해야 함 */
    room: string;
    /** 담당 강사 이름 */
    teacher: string;
    /** 수업 과목명 */
    subject: string;
    /** 수강반. 없으면 과목명만 표시 */
    group?: string | null;
    /** 현강생 수 */
    inPersonCount: number;
    /** 인강생 수 */
    onlineCount: number;
    /** 수업 상태 */
    status: ClassStatus;
}

export interface TimetableProps {
    /** 열 헤더에 표시될 교실 이름 목록 */
    classrooms: string[];
    /** 행 헤더에 표시될 교시 이름 목록 */
    periods: string[];
    /**
     * 수업 데이터 목록 (평면 배열).
     * 각 항목의 period + room 으로 어느 셀에 들어갈지 자동으로 결정됨.
     * period/room 이 classrooms/periods 에 없는 항목은 무시됨.
     */
    data: ClassEntry[];
    /**
     * 한 번에 보여줄 교시(행) 수. 기본값: 3
     * 전체 교시가 6개이고 pageSize가 3이면 → 1~3교시 / 4~6교시 로 나뉨
     */
    pageSize?: number;
    /** 수업 셀 클릭 시 호출되는 콜백. 빈 셀에서는 호출되지 않음 */
    onEntryClick?: (entry: ClassEntry) => void;
}

/* ─── 상태별 스타일 ─────────────────────────────────────────── */
const statusCellClass: Record<ClassStatus, string> = {
    normal: '',
    cancelled: 'opacity-40',
    makeup: 'bg-point/5',
};

/* ─── 상태 배지 ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: ClassStatus }) {
    if (status === 'normal') return null;

    return (
        <span
            className={[
                'inline-block rounded px-1.5 py-0.5 font-pretendard text-12 font-medium',
                status === 'cancelled' ? 'bg-gray-2 text-gray-4' : 'bg-point text-white',
            ].join(' ')}
        >
            {status === 'cancelled' ? '휴강' : '보강'}
        </span>
    );
}

/* ─── 메인 컴포넌트 ─────────────────────────────────────────── */
export default function Timetable({ classrooms, periods, data, pageSize = 3, onEntryClick }: TimetableProps) {
    /*
      페이지 상태.
      page = 0 → periods[0 ~ pageSize-1] 표시
      page = 1 → periods[pageSize ~ pageSize*2-1] 표시

      [왜 컴포넌트 내부 상태로 두나?]
      페이지 전환은 이 테이블만의 UI 상태이고,
      부모(App.tsx)가 알 필요가 없다.
      이런 경우 컴포넌트 안에서 useState 로 관리하는 게 맞다.
    */
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(periods.length / pageSize);
    const isLastPage = page === totalPages - 1;

    /* 현재 페이지에 해당하는 교시만 잘라냄 */
    const visiblePeriods = periods.slice(page * pageSize, (page + 1) * pageSize);

    const cellMap = new Map<string, ClassEntry>();
    for (const entry of data) {
        cellMap.set(`${entry.period}::${entry.room}`, entry);
    }

    /*
      현재 보이는 교시(visiblePeriods) 기준으로,
      수업이 하나라도 있는 교실만 남긴다.

      some(): 배열 중 하나라도 조건을 만족하면 true.
      → "이 교실에 현재 교시 중 수업이 하나라도 있는가?"

      페이지가 바뀌면 visiblePeriods 가 바뀌고,
      visibleClassrooms 도 자동으로 다시 계산된다. (상태 불필요)
    */
    const visibleClassrooms = classrooms.filter((classroom) =>
        visiblePeriods.some((period) => cellMap.has(`${period}::${classroom}`))
    );

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left border-y border-gray-2">
                    {/* ── 헤더 ── */}
                    <thead>
                        <tr>
                            <th className="w-16 border-b border-r border-gray-2 bg-gray-1 px-3 py-3" />
                            {visibleClassrooms.map((classroom) => (
                                <th
                                    key={classroom}
                                    className="border-b border-r border-gray-2 bg-[#F1F5F9] px-3 py-4 text-center font-pretendard text-14 font-semibold text-black last:border-r-0"
                                >
                                    <span className="text-nowrap text-[#475569]">{classroom}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* ── 본문 ── */}
                    <tbody>
                        {visiblePeriods.map((period) => (
                            <tr key={period} className="group">
                                {/* 교시 헤더 */}
                                <td className="border-b border-r border-gray-2 bg-white px-3 py-4 text-center font-pretendard text-14 font-medium text-gray-4 group-last:border-b-0">
                                    <div className="flex flex-col items-center gap-2 px-2 text-center">
                                        <span className="text-nowrap font-bold text-sm text-point">{period}</span>
                                        <span className="text-xs font-regular text-[#64748B]">
                                            {getPeriodTime(period)}
                                        </span>
                                    </div>
                                </td>

                                {/* 수업 셀 */}
                                {visibleClassrooms.map((classroom) => {
                                    const entry = cellMap.get(`${period}::${classroom}`) ?? null;

                                    return (
                                        <td
                                            key={classroom}
                                            className={[
                                                'border-b border-r border-gray-2 p-1 align-top last:border-r-0 group-last:border-b-0',
                                                entry ? statusCellClass[entry.status] : '',
                                            ].join(' ')}
                                        >
                                            {entry ? (
                                                <div
                                                    onClick={() => onEntryClick?.(entry)}
                                                    className="relative flex flex-col gap-2 min-w-[110px] h-[130px] overflow-hidden rounded-lg bg-point/10 p-2 px-3 cursor-pointer hover:brightness-95 transition-[filter] duration-150"
                                                >
                                                    <div className="absolute h-full w-1.5 bg-point left-0 top-0" />
                                                    {/* 강사명 */}
                                                    <span className="text-nowrap font-pretendard text-14 font-semibold text-black">
                                                        {entry.teacher}
                                                    </span>
                                                    {/* 과목명 + 수강반 */}
                                                    <span className="text-nowrap font-pretendard text-12 font-medium text-[#475569]">
                                                        {entry.subject}
                                                        {entry.group && (
                                                            <span className="ml-1 font-regular text-gray-4">
                                                                {entry.group}
                                                            </span>
                                                        )}
                                                    </span>

                                                    {/* 강사명 */}

                                                    {/* 수강 인원 */}
                                                    <span className="inline-block mt-2 font-pretendard text-12 font-regular text-[#0F172A]">
                                                        현강 {entry.inPersonCount}
                                                        {entry.onlineCount > 0 && `  · 인강 ${entry.onlineCount}`}
                                                    </span>

                                                    <StatusBadge status={entry.status} />
                                                </div>
                                            ) : (
                                                <span className="text-gray-2">—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── 페이지 전환 버튼 ── */}
            {/*
          totalPages > 1 일 때만 버튼을 렌더링.
          pageSize 가 충분히 커서 한 페이지에 전부 들어오면 버튼이 안 보임.

          isLastPage 여부로 방향 아이콘을 전환:
          - 마지막 페이지가 아닐 때: ↓ (다음 교시 보기)
          - 마지막 페이지일 때:     ↑ (이전 교시로 돌아가기)
        */}
            {totalPages > 1 && (
                <button
                    onClick={() => setPage(isLastPage ? page - 1 : page + 1)}
                    className="mt-1 flex w-full items-center justify-center gap-1 border border-gray-2 bg-white py-2 font-pretendard text-12 font-medium text-gray-4 hover:bg-gray-1 transition-colors duration-150"
                >
                    {isLastPage ? (
                        <>
                            이전 교시
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path
                                    d="M4 10L8 6L12 10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </>
                    ) : (
                        <>
                            다음 교시
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path
                                    d="M4 6L8 10L12 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
