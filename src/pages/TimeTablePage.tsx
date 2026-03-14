import { useState } from 'react';
import Timetable from '../components/schedule/Timetable';
import ClassDetailModal from '../components/schedule/ClassDetailModal';
import { getCurrentPeriod } from '../utils/getCurrentPeriod';
import CLASS_ROOMS from '../constants/classes';
import PERIOD from '../constants/period';
import { SegmentedControl } from '../components/ui/SegmentControl';
import WeekDayBar from '../components/schedule/WeekDayBar';
import { useFetchClassSessions } from '@/hooks/useFetchClassSessions';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';
import type { ClassSession } from '@/types/schedule/classSession.type';

const TAB_OPTIONS = [
    { label: '전체', value: 'all' as const },
    { label: '이번 교시', value: 'current' as const },
];

function TimeTablePage() {
    const [selectedType, setSelectedType] = useState<'all' | 'current'>('all');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // 선택된 수업 세션 — ClassDetailModal 표시에 사용
    const [selectedEntry, setSelectedEntry] = useState<ClassSession | null>(null);

    // getCurrentPeriod()가 null을 반환하면(22:00 이후) 마지막 교시(6)로 fallback
    const currentPeriod = getCurrentPeriod() ?? 6;

    const { data: sessions = [], isPending, isError } = useFetchClassSessions(selectedDate);

    let timetableContent: React.ReactNode;

    if (isPending) {
        timetableContent = (
            <div className="w-full flex-1 flex items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    } else if (isError) {
        timetableContent = (
            <div className="p-8 text-center text-red-400 text-sm">시간표를 불러오지 못했습니다.</div>
        );
    } else if (!Array.isArray(sessions) || sessions.length === 0) {
        timetableContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-3">
                아직 데이터가 없습니다 :(
            </div>
        );
    } else {
        // 선택된 뷰 타입에 따라 보여줄 교실 필터링
        const existingClassrooms =
            selectedType === 'all'
                ? CLASS_ROOMS.filter((room) => sessions.some((entry) => entry.roomNumber === room))
                : CLASS_ROOMS.filter((room) =>
                      sessions.some((entry) => entry.roomNumber === room && entry.periodNumber === currentPeriod),
                  );

        timetableContent = (
            <Timetable
                key={selectedType}
                pageSize={selectedType === 'current' ? 1 : 3}
                data={sessions}
                periods={selectedType === 'current' ? [currentPeriod] : PERIOD}
                classrooms={existingClassrooms}
                onEntryClick={setSelectedEntry}
            />
        );
    }

    return (
        <section className="w-full flex-1 flex flex-col py-4">
            <header className="w-full flex flex-col gap-3 max-w-[1200px] mx-auto">
                <div className="w-full px-4">
                    <SegmentedControl
                        options={TAB_OPTIONS}
                        selectedValue={selectedType}
                        onChange={(value) => setSelectedType(value)}
                    />
                </div>
                <WeekDayBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </header>
            <main className="w-full flex flex-col gap-4 xl:max-w-[1200px] xl:mx-auto flex-1 ">
                <section className="w-full flex flex-col h-full">{timetableContent}</section>
            </main>

            {selectedEntry && <ClassDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </section>
    );
}

export default TimeTablePage;
