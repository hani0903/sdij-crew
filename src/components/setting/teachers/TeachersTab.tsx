// ─── 선생님 탭 ───────────────────────────────────────────────────────────────

import { EditIcon, FileWarningIcon, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import TeacherDeleteWarningModal from './TeacherDeleteWarningModal';
import SearchInput from '@/components/ui/SearchInput';
import { useFetchAllTeachers } from '@/hooks/queries/teacher/use-fetch-all-teachers';
import type { TeacherSetting } from '@/types/teacher/teacher.type';
import TeacherInfoEditModal from './TeacherInfoEditModal';

export default function TeachersTab() {
    // 삭제 확인 모달 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // 삭제 대상 강사 ID — 추후 삭제 API 연동 시 실제 요청에 사용할 예정
    const [deleteTargetTeacherId, setDeleteTargetTeacherId] = useState<number | null>(null);

    // 편집 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // 편집 대상 강사 — null이면 모달 미렌더링
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherSetting | null>(null);

    const [query, setQuery] = useState('');

    const { data: teachers } = useFetchAllTeachers();

    const filteredTeachers = useMemo(() => {
        if (!teachers) return [];
        if (!query.trim()) return teachers;
        return teachers.filter((t) => t.name.includes(query.trim()));
    }, [teachers, query]);

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

    // 삭제 버튼 클릭 — 해당 강사 ID를 저장하고 경고 모달 열기
    const handleDeleteClick = (teacherId: number) => {
        setDeleteTargetTeacherId(teacherId);
        setIsDeleteModalOpen(true);
    };

    // 삭제 경고 모달 닫기
    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setDeleteTargetTeacherId(null);
    };

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-start gap-5 text-gray-3">
            <SearchInput value={query} placeholder="선생님 성함을 입력하세요..." onQueryChange={setQuery} />
            <main className="w-full flex-1 flex flex-col gap-2">
                <div className="w-full flex items-center justify-between gap-1">
                    <p className="flex items-center gap-1">
                        <span className="text-base font-bold text-[#0F172A]">강사님</span>
                        <span className="text-base font-bold text-point">{filteredTeachers.length}</span>
                    </p>
                </div>
                <section className="w-full flex flex-col flex-1 gap-3 overflow-y-auto pb-10">
                    {filteredTeachers.map((teacher) => (
                        <TeacherCard
                            key={teacher.id}
                            teacher={teacher}
                            onEdit={() => handleEditClick(teacher)}
                            onDelete={() => handleDeleteClick(teacher.id)}
                        />
                    ))}
                </section>
            </main>

            {/* 삭제 확인 모달 */}
            <TeacherDeleteWarningModal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <div className="w-80dvw flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center p-3 rounded-full bg-red-200 text-red-500 ">
                        <FileWarningIcon />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <h3 className="text-[#0f172a] text-xl font-bold">정말 삭제하실건가요?</h3>
                        {/* 삭제 대상 강사 이름 표시 — deleteTargetTeacherId로 목록에서 탐색 */}
                        {deleteTargetTeacherId !== null && (
                            <p className="text-point font-semibold text-sm">
                                {teachers?.find((t) => t.id === deleteTargetTeacherId)?.name ?? ''} 강사님
                            </p>
                        )}
                        <p className="text-[#475569] text-center break-keep">
                            선택한 선생님 데이터를 삭제하시겠습니까? 삭제된 데이터는 되돌릴 수 없고, 재생성해야합니다.
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        {/* TODO: 삭제 API 연동 시 deleteTargetTeacherId를 사용해 실제 삭제 요청 전송 */}
                        <button
                            type="button"
                            className="w-full p-2 rounded-lg bg-red-500 text-white font-bold"
                            onClick={handleDeleteModalClose}
                        >
                            삭제하기
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteModalClose}
                            className="w-full p-2 rounded-lg bg-[#F1F5F9] text-[#334155] font-bold"
                        >
                            취소하기
                        </button>
                    </div>
                </div>
            </TeacherDeleteWarningModal>

            {/* 편집 모달 — 편집 대상 강사가 선택됐을 때만 렌더링 */}
            {selectedTeacher && (
                <TeacherInfoEditModal
                    teacherData={selectedTeacher}
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                />
            )}
        </div>
    );
}

interface TeacherCardProps {
    teacher: TeacherSetting;
    onEdit: () => void;
    onDelete: () => void;
}

function TeacherCard({ teacher, onEdit, onDelete }: TeacherCardProps) {
    return (
        <div className="w-full p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center gap-2">
            <img className="size-12 aspect-square shrink-0 rounded-full" alt={teacher.name} />
            <p className="flex flex-col gap-1 leading-none">
                <span className="text-base font-bold text-[#1F2937]">{teacher.name}</span>
            </p>
            <div className="flex items-center gap-2 ml-auto">
                {/* 편집 버튼 — 클릭 시 해당 강사 정보 수정 모달 오픈 */}
                <button type="button" onClick={onEdit} className="p-1 cursor-pointer text-[#9CA3AF]">
                    <EditIcon className="size-4" />
                </button>
                {/* 삭제 버튼 — 클릭 시 삭제 확인 모달 오픈 */}
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 cursor-pointer text-[#fd6767] active:text-[#EC1313]"
                >
                    <Trash2Icon className="size-4" />
                </button>
            </div>
        </div>
    );
}
