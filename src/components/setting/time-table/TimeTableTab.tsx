import { useState } from 'react';
import WeekDayBar from '@/components/schedule/WeekDayBar';
import { FloatingActionButton } from '../FloatingActionButton';
import TimeTableAddModal from './TimeTableAddModal';
import SessionEditModal from './SessionEditModal';
import Timetable from '@/components/schedule/Timetable';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';
import { useFetchClassSessions } from '@/hooks/useFetchClassSessions';
import { useDeleteClassSession } from '@/hooks/queries/class-session/use-delete-class-session';
import { WarningModal } from '@/components/ui/WarningModal';
import type { ClassSession } from '@/types/schedule/classSession.type';
import CLASS_ROOMS from '@/constants/classes';
import PERIOD from '@/constants/period';
import { Button } from '@/components/ui/Button/Button';
import { KebabMenu } from '@/components/ui/KebabMenu/KebabMenu';
import { toast } from 'sonner';

export default function TimeTableTab() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    // 수업 추가 모달 열림 여부 — 단일 컴포넌트 내부 UI 상태
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
    // 삭제 대상 수업 — null이면 삭제 모달 미렌더링
    const [deleteTargetSession, setDeleteTargetSession] = useState<ClassSession | null>(null);

    const { data: sessions = [], isPending, isError } = useFetchClassSessions(selectedDate);
    const { mutate: deleteClassSession, isPending: isDeleting } = useDeleteClassSession();

    // 현재 날짜의 수업이 있는 교실만 필터링하여 빈 열 제거
    const existingClassrooms = CLASS_ROOMS.filter((room) => sessions.some((session) => session.roomNumber === room));

    const handleEdit = (entry: ClassSession) => {
        setSelectedSession(entry);
        setIsEditModalOpen(true);
    };

    const handleDelete = (entry: ClassSession) => {
        setDeleteTargetSession(entry);
    };

    const handleDeleteModalClose = () => {
        setDeleteTargetSession(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteTargetSession === null) return;
        deleteClassSession(deleteTargetSession.id, {
            onSuccess: () => {
                handleDeleteModalClose();
                toast.success('수업을 삭제하였습니다.');
            },
        });
    };

    // renderEntry: 각 셀을 기본 콘텐츠 + KebabMenu 조합으로 렌더링
    const renderEntry = (entry: ClassSession) => (
        <div className="absolute inset-1 flex flex-col gap-1.5 overflow-hidden rounded-lg bg-point/10 p-2 px-3">
            {/* 좌측 포인트 바 */}
            <div className="absolute left-0 top-0 h-full w-1.5 bg-point" />

            {/* 헤더: 선생님 이름 + 케밥 메뉴 */}
            <div className="pl-1 flex items-center justify-between">
                <span className="font-pretendard text-sm font-semibold text-black leading-none">
                    {entry.teacherName}
                </span>
                <KebabMenu
                    className="absolute shrink-0 right-0.5 top-0.5"
                    items={[
                        { label: '편집', onClick: () => handleEdit(entry) },
                        { label: '삭제', onClick: () => handleDelete(entry), variant: 'danger' },
                    ]}
                />
            </div>

            {/* 과목명 + 수강반 */}
            <div className="pl-1 flex flex-col font-pretendard text-xs font-medium text-[#475569]">
                <span className="text-point leading-tight break-keep">{entry.subject}</span>
                {entry.group && <span className="font-regular text-gray-4">{entry.group}반</span>}
            </div>

            {/* 수강 인원 */}
            <span className="pl-1 mt-auto font-pretendard text-xs font-regular text-[#0F172A] leading-tight">
                현강 {entry.inPersonCount}
                {entry.onlineCount > 0 && ` · 인강 ${entry.onlineCount}`}
            </span>
        </div>
    );

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
                renderEntry={renderEntry}
            />
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col gap-4 p-4">
            <WeekDayBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* 시간표 본문 */}
            <div className="w-full flex-1 flex flex-col">{timetableContent}</div>

            <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

            {/* date: WeekDayBar에서 선택된 날짜를 모달에 주입 */}
            <TimeTableAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} date={selectedDate} />

            {/* 수업 편집 모달 — selectedSession이 있을 때만 렌더링 */}
            {selectedSession && (
                <SessionEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedSession(null);
                    }}
                    session={selectedSession}
                />
            )}

            {/* 수업 삭제 확인 모달 — deleteTargetSession이 있을 때만 열림 */}
            <WarningModal
                isOpen={deleteTargetSession !== null}
                onClose={handleDeleteModalClose}
                title="정말 삭제하실건가요?"
                description="선택한 수업 데이터를 삭제하시겠습니까? 삭제된 데이터는 되돌릴 수 없습니다."
                highlight={
                    deleteTargetSession !== null
                        ? `${deleteTargetSession.periodNumber}교시 ${deleteTargetSession.teacherName} 강사님`
                        : undefined
                }
                confirmLabel="삭제하기"
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />
        </div>
    );
}
