// ─── 선생님 정보 조회 모달 ────────────────────────────────────────────────────

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { TeacherInfoCard } from '@/components/teacher/TeacherInfoCard';
import type { TeacherSetting } from '@/types/teacher/teacher.type';

interface TeacherInfoViewModalProps {
    teacherData: TeacherSetting;
    isOpen: boolean;
    onClose: () => void;
    /** 수정 버튼 클릭 시 편집 모달로 전환 */
    onEdit: () => void;
}

export default function TeacherInfoViewModal({ teacherData, isOpen, onClose, onEdit }: TeacherInfoViewModalProps) {
    return (
        <Modal title={`${teacherData.name} 강사님`} isOpen={isOpen} onClose={onClose}>
            <div className="px-5 pt-2 pb-2 flex-1 overflow-y-auto">
                <TeacherInfoCard data={teacherData} />
            </div>

            {/* 하단 액션 버튼 */}
            <div className="shrink-0 flex gap-3 px-5 py-4 border-t border-gray-100">
                <Button variant="secondary" className="flex-1" onClick={onClose}>
                    닫기
                </Button>
                <Button variant="primary" className="flex-1" onClick={onEdit}>
                    수정하기
                </Button>
            </div>
        </Modal>
    );
}
