import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { TeacherSetting } from '@/types/teacher/teacher.type';
import { useState } from 'react';
import { useUpdateTeacher } from '@/hooks/queries/teacher/use-update-teacher';
import { TeacherFormBody, type TeacherFormValue } from './TeacherFormBody';

// ─── 선생님 정보 수정 모달 ────────────────────────────────────────────────────

interface TeacherInfoEditModalProps {
    teacherData: TeacherSetting;
    isOpen: boolean;
    onClose: () => void;
}

export default function TeacherInfoEditModal({ teacherData, isOpen, onClose }: TeacherInfoEditModalProps) {
    // 폼 상태 — teacherData로 초기화
    const [formData, setFormData] = useState<TeacherFormValue>(teacherData);

    const { mutate: updateTeacher, isPending } = useUpdateTeacher();

    // 저장 버튼 클릭 → API 호출
    const handleSave = () => {
        // 이메일: '@'가 포함된 완전한 형태일 때만 전송, 그렇지 않으면 undefined
        const emailValue = formData.email?.includes('@') ? formData.email : undefined;

        updateTeacher(
            {
                id: teacherData.id,
                params: {
                    name: formData.name,
                    chalkType: formData.chalkType,
                    chalkDetail: formData.chalkDetail,
                    // 빈 문자열은 undefined로 변환해 서버에 "값 없음"을 전달
                    eraserDetail: formData.eraserDetail || undefined,
                    micType: formData.micType,
                    hasPpt: formData.hasPpt,
                    // undefined는 JSON 직렬화 시 키가 제거되므로 null로 명시
                    notes: formData.notes ?? null,
                    email: emailValue,
                },
            },
            {
                // 저장 성공 시 모달 닫기
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <Modal title="선생님 정보 수정하기" isOpen={isOpen} onClose={onClose}>
            {/* 폼 필드 영역 — TeacherFormBody가 담당 */}
            <TeacherFormBody value={formData} onChange={setFormData} />

            {/* 하단 액션 버튼 영역 — Modal 컴포넌트가 footer slot을 지원하지 않으므로 직접 구성 */}
            <div className="shrink-0 flex gap-3 px-5 py-4 border-t border-gray-100">
                <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isPending}>
                    취소
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} disabled={isPending}>
                    {isPending ? '저장 중...' : '저장'}
                </Button>
            </div>
        </Modal>
    );
}
