import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { useCreateTeacher } from '@/hooks/queries/teacher/use-create-teacher';
import { TeacherFormBody, type TeacherFormValue } from './TeacherFormBody';
import { toast } from 'sonner';

// ─── 강사 신규 생성 폼 기본값 ─────────────────────────────────────────────────

const DEFAULT_FORM_VALUE: TeacherFormValue = {
    name: '',
    chalkType: 'ACADEMY',
    chalkDetail: '',
    eraserDetail: '',
    micType: 'ACADEMY',
    hasPpt: false,
    notes: '',
    email: '',
};

// ─── 선생님 추가 모달 ─────────────────────────────────────────────────────────

interface TeacherCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TeacherCreateModal({ isOpen, onClose }: TeacherCreateModalProps) {
    // 폼 상태 — 기본값으로 초기화
    const [formData, setFormData] = useState<TeacherFormValue>(DEFAULT_FORM_VALUE);

    const { mutate: createTeacher, isPending } = useCreateTeacher();

    const handleSave = () => {
        // 이메일: '@'가 포함된 완전한 형태일 때만 전송, 그렇지 않으면 undefined
        const emailValue = formData.email?.includes('@') ? formData.email : undefined;

        if (formData.name.length <= 0) {
            toast.error('선생님 이름을 입력해주세요');
            return;
        }

        createTeacher(
            {
                name: formData.name,
                chalkType: formData.chalkType,
                chalkDetail: formData.chalkDetail,
                // 빈 문자열은 undefined로 변환해 서버에 "값 없음"을 전달
                eraserDetail: formData.eraserDetail || undefined,
                micType: formData.micType,
                hasPpt: formData.hasPpt,
                notes: formData.notes || undefined,
                email: emailValue,
            },
            {
                // 생성 성공 시 모달 닫고 폼 초기화
                onSuccess: () => {
                    setFormData(DEFAULT_FORM_VALUE);
                    toast.success('선생님이 저장되었습니다.');
                    onClose();
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
        );
    };

    // 취소 시 폼 초기화 후 모달 닫기
    const handleClose = () => {
        setFormData(DEFAULT_FORM_VALUE);
        onClose();
    };

    return (
        <Modal title="선생님 추가하기" isOpen={isOpen} onClose={handleClose}>
            {/* 폼 필드 영역 — TeacherFormBody가 담당 */}
            <TeacherFormBody value={formData} onChange={setFormData} />

            {/* 하단 액션 버튼 영역 */}
            <div className="shrink-0 flex gap-3 px-5 py-4 border-t border-gray-100">
                <Button variant="secondary" className="flex-1" onClick={handleClose} disabled={isPending}>
                    취소
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} disabled={isPending}>
                    {isPending ? '추가 중...' : '추가'}
                </Button>
            </div>
        </Modal>
    );
}
