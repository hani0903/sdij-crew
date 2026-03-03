import WeekDayBar from '@/components/schedule/WeekDayBar';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { FloatingActionButton } from '../FloatingActionButton';
import TimeTableAddModal from './TimeTableAddModal';

export default function TimeTableTab() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // 수업 추가 모달 열림 여부 — 단일 컴포넌트 내부 UI 상태이므로 useState 사용
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="relative w-full h-full flex flex-col gap-4">
            <WeekDayBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
                <p>시간표 데이터가 없습니다.</p>
                <Button variant="primary" size={'sm'}>
                    저번 주 데이터 불러오기
                </Button>
            </div>

            <ol className="w-full flex flex-col gap-4">
                <li className="w-full">
                    <div></div>
                </li>
            </ol>

            <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

            <TimeTableAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
