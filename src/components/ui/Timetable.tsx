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
export default function Timetable({ classrooms, periods, data }: TimetableProps) {
    /*
      [왜 Map 을 쓰나?]

      data 가 평면 배열이기 때문에, 특정 교시+교실의 수업을 찾으려면
      매 셀마다 data.find() 를 돌리면 O(n²) 이 된다.
      (6교시 × 8교실 = 48번 렌더링, 각각 최대 데이터 전체를 순회)

      Map 에 미리 "교시::교실" → entry 로 저장해두면 O(1) 로 조회 가능.
      데이터가 커질수록 Map 이 훨씬 빠르다.

      key 형식: `${period}::${room}` (예: '1교시::601호')
      :: 구분자를 쓴 이유: period 나 room 에 - 나 _ 가 들어올 수 있기 때문
    */
    const cellMap = new Map<string, ClassEntry>();
    for (const entry of data) {
        cellMap.set(`${entry.period}::${entry.room}`, entry);
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-2">
            <table className="w-full border-collapse text-left">
                {/* ── 헤더 ── */}
                <thead>
                    <tr>
                        <th className="w-16 border-b border-r border-gray-2 bg-gray-1 px-3 py-3" />
                        {classrooms.map((classroom) => (
                            <th
                                key={classroom}
                                className="border-b border-r border-gray-2 bg-gray-1 px-3 py-3 text-center font-pretendard text-14 font-semibold text-black last:border-r-0"
                            >
                                <span className="text-nowrap">{classroom}</span>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* ── 본문 ── */}
                <tbody>
                    {periods.map((period) => (
                        <tr key={period} className="group">
                            {/* 교시 헤더 */}
                            <td className="border-b border-r border-gray-2 bg-gray-1 px-3 py-4 text-center font-pretendard text-14 font-medium text-gray-4 group-last:border-b-0">
                                <div className="flex flex-col items-center gap-2 px-2 text-center">
                                    <span className="text-nowrap">{period}</span>
                                    <span className="text-xs font-regular text-gray-3">{getPeriodTime(period)}</span>
                                </div>
                            </td>

                            {/* 수업 셀 */}
                            {classrooms.map((classroom) => {
                                const entry = cellMap.get(`${period}::${classroom}`) ?? null;

                                return (
                                    <td
                                        key={classroom}
                                        className={[
                                            'border-b border-r border-gray-2 px-3 py-3 align-top last:border-r-0 group-last:border-b-0',
                                            entry ? statusCellClass[entry.status] : '',
                                        ].join(' ')}
                                    >
                                        {entry ? (
                                            <div className="flex flex-col gap-1 min-w-[90px]">
                                                {/* 강사명 */}
                                                <span className="text-nowrap font-pretendard text-14 font-semibold text-black">
                                                    {entry.teacher}
                                                </span>
                                                {/* 과목명 + 수강반 */}
                                                <span className="text-nowrap font-pretendard text-12 font-regular text-gray-4">
                                                    {entry.subject}
                                                    {entry.group && (
                                                        <span className="ml-1 font-regular text-gray-4">
                                                            {entry.group}
                                                        </span>
                                                    )}
                                                </span>

                                                {/* 강사명 */}

                                                {/* 수강 인원 */}
                                                <span className="font-pretendard text-12 font-regular text-gray-3">
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
    );
}
