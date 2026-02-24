import { useState } from 'react';
import Timetable, { type ClassEntry } from '../components/schedule/Timetable';
import ClassDetailModal from '../components/schedule/ClassDetailModal';
import { getCurrentPeriod } from '../utils/getCurrentPeriod';
import CLASS_ROOMS from '../constants/classes';
import PERIOD from '../constants/period';
import { SegmentedControl } from '../components/ui/SegmentControl';
import getCurrentWeekDays from '../utils/getCurrentWeekday';
import WeekDayBar from '../components/schedule/WeekDayBar';

const TAB_OPTIONS = [
    { label: '전체', value: 'all' as const },
    { label: '이번 교시', value: 'current' as const },
];

const TUESDAY_DATA: ClassEntry[] = [
    {
        period: '1교시',
        room: '604호',
        teacher: '김윤환',
        subject: '인문논술',
        group: 'A(선택)반',
        inPersonCount: 27,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'S반',
        inPersonCount: 127,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '608호',
        teacher: '정태혁',
        subject: '지1',
        group: 'B반',
        inPersonCount: 130,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '605호',
        teacher: '장재원',
        subject: '수학(수2)',
        group: 'S반',
        inPersonCount: 71,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '603호',
        teacher: '이동선',
        subject: '수학(수2)',
        group: 'D반',
        inPersonCount: 124,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '604호',
        teacher: '김윤환',
        subject: '인문논술',
        group: 'B(선택)반',
        inPersonCount: 116,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'N반',
        inPersonCount: 98,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '607호',
        teacher: '송준혁',
        subject: '과목 아직 모름',
        group: 'O반',
        inPersonCount: 125,
        onlineCount: 0,
        status: 'cancelled',
    },
    {
        period: '2교시',
        room: '608호',
        teacher: '정태혁',
        subject: '지1',
        group: 'C반',
        inPersonCount: 21,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '603호',
        teacher: '이동선',
        subject: '수학(수2)',
        group: 'O반',
        inPersonCount: 125,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'D반',
        inPersonCount: 124,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '607호',
        teacher: '송준혁',
        subject: '과목 아직 모름',
        group: 'S반',
        inPersonCount: 72,
        onlineCount: 0,
        status: 'cancelled',
    },
    {
        period: '3교시',
        room: '608호',
        teacher: '김미향',
        subject: '생윤',
        group: 'A(1)반',
        inPersonCount: 47,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '604호',
        teacher: '현정훈',
        subject: '물1',
        group: 'A반',
        inPersonCount: 107,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '608호',
        teacher: '김미향',
        subject: '사문',
        group: 'A(1)반',
        inPersonCount: 127,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '601호',
        teacher: '현정훈',
        subject: '물2',
        group: '선택반',
        inPersonCount: 35,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '602호',
        teacher: '박근수',
        subject: '정법',
        group: null,
        inPersonCount: 29,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '601호',
        teacher: '현정훈',
        subject: '물2',
        group: '선택반',
        inPersonCount: 35,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '602호',
        teacher: '박근수',
        subject: '정법',
        group: null,
        inPersonCount: 29,
        onlineCount: 0,
        status: 'normal',
    },
];

function TimeTablePage() {
    /** 시간표 형태 */
    const [selectedType, setSelectedType] = useState<'all' | 'current'>('all');

    /** 선택된 요일 */
    const [selectedWeekday, setSelectedWeekday] = useState(getCurrentWeekDays);

    /** 열린 모달 */
    const [selectedEntry, setSelectedEntry] = useState<ClassEntry | null>(null);
    const currentPeriod = getCurrentPeriod(); // 현재 교시 갖고 오기

    const existingClassrooms =
        selectedType === 'all'
            ? CLASS_ROOMS.filter((room) =>
                  // data(2차원 배열)를 순회하며 해당 강의실을 사용하는 수업이 있는지 확인
                  TUESDAY_DATA.some((data) => data.room === room),
              )
            : CLASS_ROOMS.filter((room) =>
                  // data(2차원 배열)를 순회하며 해당 강의실을 사용하는 수업이 있는지 확인
                  TUESDAY_DATA.some((data) => data.room === room && data.period === currentPeriod),
              );

    let timeTable = <></>;
    if (selectedType === 'current') {
        timeTable = (
            <Timetable
                key="current"
                pageSize={1}
                data={TUESDAY_DATA}
                periods={[currentPeriod]}
                classrooms={existingClassrooms}
                onEntryClick={setSelectedEntry}
            />
        );
    } else {
        timeTable = (
            <Timetable
                key="all"
                data={TUESDAY_DATA}
                periods={PERIOD}
                classrooms={existingClassrooms}
                onEntryClick={setSelectedEntry}
            />
        );
    }

    return (
        <section className="w-full flex flex-col py-4">
            <header className="w-full flex flex-col gap-3 max-w-[1200px] mx-auto">
                <div className="w-full px-4">
                    <SegmentedControl
                        options={TAB_OPTIONS}
                        selectedValue={selectedType}
                        onChange={(value) => setSelectedType(value)}
                    />
                </div>
                {/* <ul className="w-full flex items-center justify-center transition-all duration-200 border-b-2 border-[#E2E8F0] px-2">
                    {getWeekDays().map((weekday) =>
                        ['토', '일'].includes(weekday.weekday) ? (
                            <li className="relative flex flex-col gap-2 p-4 text-[#94A3B8] text-12 font-semibold items-center flex-1">
                                {weekday.isToday && (
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 size-1 bg-red-500 rounded-full"></span>
                                )}
                                <span className="inline-block">{weekday.weekday}</span>
                                <span className="text-14">{weekday.dayNumber}</span>
                            </li>
                        ) : (
                            <li className="relative flex flex-col gap-2 p-4 text-[#0F172A] text-12 font-semibold items-center flex-1">
                                {weekday.isToday && (
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 size-1 bg-red-500 rounded-full"></span>
                                )}
                                <span className="inline-block">{weekday.weekday}</span>
                                <span className="text-14">{weekday.dayNumber}</span>
                            </li>
                        ),
                    )}
                </ul> */}
                <WeekDayBar onSelectWeekday={setSelectedWeekday} selectedWeekday={selectedWeekday} />
            </header>
            <main className="w-full flex flex-col gap-4 xl:max-w-[1200px] xl:mx-auto">
                <section className="w-full flex flex-col">{timeTable}</section>
            </main>

            {selectedEntry && <ClassDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </section>
    );
}

export default TimeTablePage;
