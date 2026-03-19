import { useState } from 'react';
import WeekDayBar from '@/components/schedule/WeekDayBar';
import { FloatingActionButton } from '../FloatingActionButton';
import TimeTableAddModal from './TimeTableAddModal';
import Timetable from '@/components/schedule/Timetable';
import ClassDetailModal from '@/components/schedule/ClassDetailModal';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';
import { useFetchClassSessions } from '@/hooks/useFetchClassSessions';
import type { ClassSession } from '@/types/schedule/classSession.type';
import CLASS_ROOMS from '@/constants/classes';
import PERIOD from '@/constants/period';
import { Button } from '@/components/ui/Button/Button';

export default function TimeTableTab() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // 수업 추가 모달 열림 여부 — 단일 컴포넌트 내부 UI 상태
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // 선택된 수업 세션 — ClassDetailModal 표시에 사용
    const [selectedEntry, setSelectedEntry] = useState<ClassSession | null>(null);

    const { data: sessions = [], isPending, isError } = useFetchClassSessions(selectedDate);

    // 현재 날짜의 수업이 있는 교실만 필터링하여 빈 열 제거
    const existingClassrooms = CLASS_ROOMS.filter((room) => sessions.some((session) => session.roomNumber === room));

    // 시간표 영역 콘텐츠 결정
    let timetableContent: React.ReactNode;

    if (isPending) {
        timetableContent = (
            <div className="w-full flex-1 flex items-center justify-center py-16">
                <CircularLoadingSpinner />
            </div>
        );
    } else if (isError) {
        timetableContent = (
            <div className="w-full flex-1 flex items-center justify-center py-16 text-red-400 text-sm">
                시간표를 불러오지 못했습니다.
            </div>
        );
    } else if (sessions.length === 0) {
        timetableContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-16 gap-2 text-gray-3 text-sm">
                <p>등록된 수업이 없습니다.</p>
                <Button onClick={() => {}}>지난 주 데이터 불러오기</Button>
            </div>
        );
    } else {
        timetableContent = (
            <Timetable
                data={sessions}
                periods={PERIOD}
                classrooms={existingClassrooms}
                pageSize={3}
                onEntryClick={setSelectedEntry}
            />
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col gap-4">
            <WeekDayBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* 시간표 본문 */}
            <div className="w-full flex-1 flex flex-col">{timetableContent}</div>

            <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

            {/* date: WeekDayBar에서 선택된 날짜를 모달에 주입 */}
            <TimeTableAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} date={selectedDate} />

            {/* 수업 셀 클릭 시 상세 모달 표시 */}
            {selectedEntry && <ClassDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </div>
    );
}
