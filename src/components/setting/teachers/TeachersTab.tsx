// ─── 선생님 탭 ───────────────────────────────────────────────────────────────

import { EditIcon, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WarningModal } from '@/components/ui/WarningModal';
import SearchInput from '@/components/ui/SearchInput';
import { useFetchAllTeachers } from '@/hooks/queries/teacher/use-fetch-all-teachers';
import { useDeleteTeacher } from '@/hooks/queries/teacher/use-delete-teacher';
import type { TeacherSetting } from '@/types/teacher/teacher.type';
import TeacherInfoEditModal from './TeacherInfoEditModal';
import TeacherInfoViewModal from './TeacherInfoViewModal';
import TeacherCreateModal from './TeacherCreateModal';
import { Button } from '@/components/ui/Button/Button';
import { PlusIcon } from '@/assets';
import defaultImg from '@/assets/icons/default-profile.svg';

export default function TeachersTab() {
    // 삭제 확인 모달 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // 삭제 대상 강사 — null이면 모달 미렌더링
    const [deleteTargetTeacher, setDeleteTargetTeacher] = useState<TeacherSetting | null>(null);

    // 조회 모달 상태
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // 편집 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 강사 추가 모달 상태
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 조회/편집 대상 강사 — null이면 모달 미렌더링
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherSetting | null>(null);

    const [query, setQuery] = useState('');

    const { data: teachers } = useFetchAllTeachers();
    const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher();

    const filteredTeachers = useMemo(() => {
        if (!teachers) return [];
        if (!query.trim()) return teachers;
        return teachers.filter((t) => t.name.includes(query.trim()));
    }, [teachers, query]);

    // 카드 클릭 — 조회 모달 열기
    const handleViewClick = (teacher: TeacherSetting) => {
        setSelectedTeacher(teacher);
        setIsViewModalOpen(true);
    };

    // 조회 모달 닫기
    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
        setTimeout(() => setSelectedTeacher(null), 300);
    };

    // 조회 모달에서 수정하기 버튼 → 편집 모달로 전환
    const handleViewToEdit = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(true);
    };

    // 편집 버튼 클릭 — 해당 강사 데이터를 저장하고 모달 열기
    const handleEditClick = (teacher: TeacherSetting) => {
        setSelectedTeacher(teacher);
        setIsEditModalOpen(true);
    };

    // 편집 모달 닫기
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        // 모달 닫힌 후 애니메이션이 끝나면 선택 데이터 초기화
        setTimeout(() => setSelectedTeacher(null), 300);
    };

    // 삭제 버튼 클릭 — 해당 강사를 저장하고 경고 모달 열기
    const handleDeleteClick = (teacher: TeacherSetting) => {
        setDeleteTargetTeacher(teacher);
        setIsDeleteModalOpen(true);
    };

    // 삭제 경고 모달 닫기
    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setTimeout(() => setDeleteTargetTeacher(null), 300);
    };

    // 삭제 확인 — API 호출 후 모달 닫기
    const handleDeleteConfirm = () => {
        if (deleteTargetTeacher === null) return;
        deleteTeacher(deleteTargetTeacher.id, {
            onSuccess: handleDeleteModalClose,
        });
    };

    return (
        <div className="w-full flex-1 flex flex-col text-gray-3">
            {/* SearchInput: 스크롤 컨테이너(SettingPage content div) 기준으로 상단 고정 */}
            <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-3 flex items-center gap-2">
                <SearchInput value={query} placeholder="선생님 성함을 입력하세요..." onQueryChange={setQuery} />
                {/* 강사 추가 버튼 */}
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <PlusIcon />
                </Button>
            </div>
            <main className="w-full flex flex-col gap-2 px-4 pb-10">
                <div className="w-full flex items-center justify-between gap-1 pt-3">
                    <p className="flex items-center gap-1">
                        <span className="text-base font-bold text-[#0F172A]">강사님</span>
                        <span className="text-base font-bold text-point">{filteredTeachers.length}</span>
                    </p>
                </div>
                <section className="w-full flex flex-col gap-3">
                    {filteredTeachers.map((teacher) => (
                        <TeacherCard
                            key={teacher.id}
                            teacher={teacher}
                            onView={() => handleViewClick(teacher)}
                            onEdit={() => handleEditClick(teacher)}
                            onDelete={() => handleDeleteClick(teacher)}
                        />
                    ))}
                </section>
            </main>

            {/* 삭제 확인 모달 */}
            <WarningModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                title="정말 삭제하실건가요?"
                description="선택한 선생님 데이터를 삭제하시겠습니까? 삭제된 데이터는 되돌릴 수 없고, 재생성해야합니다."
                highlight={deleteTargetTeacher !== null ? `${deleteTargetTeacher.name} 강사님` : undefined}
                confirmLabel="삭제하기"
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />

            {/* 조회 모달 — 선택된 강사가 있을 때만 렌더링 */}
            {selectedTeacher !== null && (
                <TeacherInfoViewModal
                    teacherData={selectedTeacher}
                    isOpen={isViewModalOpen}
                    onClose={handleViewModalClose}
                    onEdit={handleViewToEdit}
                />
            )}

            {/* 편집 모달 — 편집 대상 강사가 선택됐을 때만 렌더링 (타입 안전) */}
            {selectedTeacher !== null && (
                <TeacherInfoEditModal
                    teacherData={selectedTeacher}
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                />
            )}

            {/* 강사 추가 모달 */}
            <TeacherCreateModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}

interface TeacherCardProps {
    teacher: TeacherSetting;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function TeacherCard({ teacher, onView, onEdit, onDelete }: TeacherCardProps) {
    return (
        <div
            className="w-full p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center gap-2 cursor-pointer active:bg-[#F3F4F6]"
            onClick={onView}
        >
            <img src={defaultImg} className="size-10 aspect-square shrink-0 rounded-full" alt={teacher.name} />
            <p className="flex flex-col gap-1 leading-none">
                <span className="text-base font-bold text-[#1F2937]">{teacher.name}</span>
            </p>
            <div className="flex items-center gap-2 ml-auto">
                {/* 편집 버튼 — 클릭 시 해당 강사 정보 수정 모달 오픈 */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1 cursor-pointer text-[#9CA3AF]"
                >
                    <EditIcon className="size-4" />
                </button>
                {/* 삭제 버튼 — 클릭 시 삭제 확인 모달 오픈 */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1 cursor-pointer text-[#fd6767] active:text-[#EC1313]"
                >
                    <Trash2Icon className="size-4" />
                </button>
            </div>
        </div>
    );
}
