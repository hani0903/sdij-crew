import { useState, type ReactNode } from 'react';
import { getPeriodTime } from '../../utils/getPeriodTime';
import type { ClassSession } from '@/types/schedule/classSession.type';

export type ClassStatus = 'NORMAL' | 'CANCELLED' | 'MAKEUP';

export type TimetableProps =
    | {
          /** 열 헤더에 표시될 교실 이름 목록 */
          classrooms: number[];
          /** 행 헤더에 표시될 교시 이름 목록 */
          periods: number[];
          /**
           * 수업 데이터 목록 (평면 배열).
           * 각 항목의 period + room 으로 어느 셀에 들어갈지 자동으로 결정됨.
           * period/room 이 classrooms/periods 에 없는 항목은 무시됨.
           */
          data: ClassSession[];
          /**
           * 한 번에 보여줄 교시(행) 수. 기본값: 3
           * 전체 교시가 6개이고 pageSize가 3이면 → 1~3교시 / 4~6교시 로 나뉨
           */
          pageSize?: number;
          /** 수업 셀 클릭 시 호출되는 콜백. 빈 셀에서는 호출되지 않음. renderEntry와 함께 사용 불가 */
          onEntryClick?: (entry: ClassSession) => void;
          renderEntry?: never;
      }
    | {
          classrooms: number[];
          periods: number[];
          data: ClassSession[];
          pageSize?: number;
          /**
           * 수업 셀의 내용을 소비자가 완전히 제어하는 render prop.
           * renderEntry가 제공되면 onEntryClick은 무시됨.
           */
          renderEntry: (entry: ClassSession) => ReactNode;
          onEntryClick?: never;
      };

/* ─── 상태별 스타일 ─────────────────────────────────────────── */
const statusCellClass: Record<ClassStatus, string> = {
    NORMAL: '',
    CANCELLED: 'opacity-40',
    MAKEUP: 'bg-point/5',
};

/* ─── 상태 배지 ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: ClassStatus }) {
    if (status === 'NORMAL') return null;

    return (
        <span
            className={[
                'inline-block rounded px-1.5 py-0.5 font-pretendard text-xs font-medium',
                status === 'CANCELLED' ? 'bg-gray-2 text-gray-4' : 'bg-point text-white',
            ].join(' ')}
        >
            {status === 'CANCELLED' ? '휴강' : '보강'}
        </span>
    );
}

/* ─── 기본 셀 콘텐츠 ────────────────────────────────────────── */
interface DefaultEntryContentProps {
    entry: ClassSession;
    onClick?: (entry: ClassSession) => void;
}

function DefaultEntryContent({ entry, onClick }: DefaultEntryContentProps) {
    return (
        <div
            onClick={() => onClick?.(entry)}
            // absolute inset-1으로 td를 4px남기고 꽉 채움
            className="absolute inset-1 flex flex-col gap-1.5 overflow-hidden rounded-lg bg-point/10 p-2 px-3 cursor-pointer hover:brightness-95 transition-[filter] duration-150"
        >
            <div className="absolute left-0 top-0 h-full w-1.5 bg-point" />

            <span className="pl-1 font-pretendard text-sm font-semibold text-black leading-none">
                {entry.teacherName}
            </span>

            {/* 과목명 + 수강반 — text-nowrap 제거, 자연 줄바꿈 허용 */}
            <div className="pl-1 flex flex-col font-pretendard text-xs font-medium text-[#475569]">
                <span className="text-point leading-tight break-keep">{entry.subject}</span>
                {entry.group && <span className="font-regular text-gray-4">{entry.group}반</span>}
            </div>

            {/* 수강 인원 */}
            <span className="pl-1 mt-auto font-pretendard text-xs font-regular text-[#0F172A] leading-tight">
                현강 {entry.inPersonCount}
                {entry.onlineCount > 0 && ` · 인강 ${entry.onlineCount}`}
            </span>

            <StatusBadge status={entry.status} />
        </div>
    );
}

/* ─── 메인 컴포넌트 ─────────────────────────────────────────── */
export default function Timetable({ classrooms, periods, data, pageSize = 3, onEntryClick, renderEntry }: TimetableProps) {
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

    const cellMap = new Map<string, ClassSession>();
    for (const entry of data) {
        cellMap.set(`${entry.periodNumber}::${entry.roomNumber}`, entry);
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
        visiblePeriods.some((period) => cellMap.has(`${period}::${classroom}`)),
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
                                    className="border-b border-r border-gray-2 bg-gray-1 py-2 text-center font-pretendard text-sm font-semibold text-black last:border-r-0"
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
                                {/* 교시 헤더 — periodNumber(number)를 "N교시" 형식으로 포맷팅 */}
                                <td className="border-b border-r border-gray-2 bg-white px-3 py-4 text-center font-pretendard text-sm font-medium text-gray-4 group-last:border-b-0">
                                    <div className="flex flex-col items-center gap-1  text-center">
                                        <span className="text-nowrap font-bold text-sm text-point">{period}교시</span>
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
                                                // 기본 테두리/정렬
                                                'relative border-b border-r border-gray-2 last:border-r-0 group-last:border-b-0',
                                                // td 자체에 최소 크기만 지정, 실제 크기는 테이블 레이아웃이 결정
                                                'min-w-[120px] min-h-[80px]',
                                                entry ? statusCellClass[entry.status] : '',
                                            ].join(' ')}
                                        >
                                            {entry ? (
                                                renderEntry ? (
                                                    renderEntry(entry)
                                                ) : (
                                                    <DefaultEntryContent entry={entry} onClick={onEntryClick} />
                                                )
                                            ) : (
                                                // 빈 셀도 절대위치로 중앙 정렬
                                                <div className="absolute inset-1 flex items-start justify-start">
                                                    <span className="text-gray-2">—</span>
                                                </div>
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
                    className="mt-1 flex w-full items-center justify-center gap-1 border border-gray-2 bg-white py-2 font-pretendard text-xs font-medium text-gray-4 hover:bg-gray-1 transition-colors duration-150"
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
