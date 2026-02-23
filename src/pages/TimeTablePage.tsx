import { useState } from 'react';
import Timetable, { type ClassEntry } from '../components/ui/Timetable';
import ClassDetailModal from '../components/ui/ClassDetailModal';
import CalendarIcon from '../assets/icons/calendar.svg?react';
import { getCurrentPeriod } from '../utils/getCurrentPeriod';

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
    const [selectedType, setSelectedType] = useState<'all' | 'current'>('all');
    const [selectedEntry, setSelectedEntry] = useState<ClassEntry | null>(null);
    const currentPeriod = getCurrentPeriod();

    const classrooms = ['601호', '602호', '603호', '604호', '605호', '606호', '607호', '608호'];

    const existingClassrooms =
        selectedType === 'all'
            ? classrooms.filter((room) =>
                  // data(2차원 배열)를 순회하며 해당 강의실을 사용하는 수업이 있는지 확인
                  TUESDAY_DATA.some((data) => data.room === room),
              )
            : classrooms.filter((room) =>
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
                periods={['1교시', '2교시', '3교시', '4교시', '5교시', '6교시']}
                classrooms={existingClassrooms}
                onEntryClick={setSelectedEntry}
            />
        );
    }

    return (
        <div className="w-full flex flex-col">
            <header className="w-full p-4 flex flex-col gap-3 max-w-[1200px] mx-auto">
                <h2 className="text-[18px] font-bold flex items-center gap-3">
                    <span className=" p-1.5 bg-point/10 text-point rounded-lg flex items-center justify-center">
                        <CalendarIcon className="size-5" />
                    </span>
                    화요일 시간표
                </h2>
                <nav className="rounded-lg bg-gray-1 w-fit overflow-hidden">
                    <ul className=" flex items-center list-none text-sm font-medium text-gray-3">
                        <li>
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`${selectedType === 'all' ? 'font-bold text-point cursor-pointer p-2 bg-point/10' : 'cursor-pointer p-2'}`}
                            >
                                전체
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setSelectedType('current')}
                                className={`${selectedType === 'current' ? 'font-bold text-point cursor-pointer bg-point/10 p-2' : 'cursor-pointer p-2'}`}
                            >
                                이번 교시
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="w-full flex flex-col gap-4 xl:max-w-[1200px] xl:mx-auto">
                <section className="w-full flex flex-col">{timeTable}</section>
            </main>

            {selectedEntry && <ClassDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </div>
    );
}

export default TimeTablePage;
