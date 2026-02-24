import { useState } from 'react';
import Timetable, { type ClassEntry } from '../components/schedule/Timetable';
import ClassDetailModal from '../components/schedule/ClassDetailModal';
import { getCurrentPeriod } from '../utils/getCurrentPeriod';
import { toClassEntry } from '../utils/classSessionAdapter';
import CLASS_ROOMS from '../constants/classes';
import PERIOD from '../constants/period';
import { SegmentedControl } from '../components/ui/SegmentControl';
import WeekDayBar from '../components/schedule/WeekDayBar';
import { useFetchClassSessions } from '@/hooks/useFetchClassSessions';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';

const TAB_OPTIONS = [
    { label: '전체', value: 'all' as const },
    { label: '이번 교시', value: 'current' as const },
];

function TimeTablePage() {
    const [selectedType, setSelectedType] = useState<'all' | 'current'>('all');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedEntry, setSelectedEntry] = useState<ClassEntry | null>(null);

    const currentPeriod = getCurrentPeriod();

    const { data: sessions = [], isPending, isError } = useFetchClassSessions(selectedDate);

    let timetableContent;

    if (isPending) {
        timetableContent = (
            <div className="w-full flex-1 flex items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    } else if (!sessions || sessions.length <= 0) {
        timetableContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-3">
                아직 데이터가 없습니다 :(
            </div>
        );
    } else {
        const classEntries = sessions.map(toClassEntry);

        const existingClassrooms =
            selectedType === 'all'
                ? CLASS_ROOMS.filter((room) => classEntries.some((entry) => entry.room === room))
                : CLASS_ROOMS.filter((room) =>
                      classEntries.some((entry) => entry.room === room && entry.period === currentPeriod),
                  );

        timetableContent = (() => {
            if (isPending) return <div className="p-8 text-center text-gray-4 text-14">시간표를 불러오는 중...</div>;
            if (isError)
                return <div className="p-8 text-center text-red-400 text-14">시간표를 불러오지 못했습니다.</div>;
            return (
                <Timetable
                    key={selectedType}
                    pageSize={selectedType === 'current' ? 1 : 3}
                    data={classEntries}
                    periods={selectedType === 'current' ? [currentPeriod] : PERIOD}
                    classrooms={existingClassrooms}
                    onEntryClick={setSelectedEntry}
                />
            );
        })();
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
