import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import type { ClassSession, ClassSessionStatus } from '@/types/schedule/classSession.type';
import Dropdown from '@/components/ui/dropdown';
import Input from '@/components/ui/Input/Input';
import PERIOD from '@/constants/period';
import CLASS_ROOMS from '@/constants/classes';
import TeacherCombobox from '@/components/setting/teachers/TeacherCombobox';
import FormField from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button/Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    /** 편집할 세션 데이터 — 각 폼 필드의 초기값으로 사용 */
    session: ClassSession;
}

interface SessionEditForm {
    periodNumber: number | '';
    classroomId: number | '';
    teacherName: string;
    subject: string;
    group: string;
    inPersonCount: number;
    onlineCount: number;
    classStatus: ClassSessionStatus;
}

// ─── 상수 ──────────────────────────────────────────────────────────────────

/** 교시 드롭다운 항목 — TimeTableAddModal과 동일한 방식으로 생성 */
const PERIOD_ITEMS = PERIOD.map((periodNumber) => ({
    id: String(periodNumber),
    title: `${periodNumber}교시`,
}));

/** 강의실 드롭다운 항목 — TimeTableAddModal과 동일한 방식으로 생성 */
const CLASSROOM_ITEMS = CLASS_ROOMS.map((roomNumber) => ({
    id: String(roomNumber),
    title: `${roomNumber}호`,
}));

// ─── 유틸 ──────────────────────────────────────────────────────────────────

/** ClassSession 서버 응답 → 편집 폼 초기값 변환 */
function sessionToForm(session: ClassSession): SessionEditForm {
    return {
        periodNumber: session.periodNumber,
        // roomNumber는 강의실 번호(601, 602…) 그대로 사용
        classroomId: session.roomNumber,
        teacherName: session.teacherName,
        subject: session.subject,
        group: session.group,
        inPersonCount: session.inPersonCount,
        onlineCount: session.onlineCount,
        classStatus: session.status,
    };
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────────

export default function SessionEditModal({ isOpen, onClose, session }: Props) {
    const [form, setForm] = useState<SessionEditForm>(() => sessionToForm(session));

    // session prop이 변경될 때 폼 초기화
    // (동일 모달 인스턴스를 재사용하는 경우를 대비)
    const [prevSessionId, setPrevSessionId] = useState(session.id);
    if (session.id !== prevSessionId) {
        setPrevSessionId(session.id);
        setForm(sessionToForm(session));
    }

    // ── 핸들러 ─────────────────────────────────────────────────────────────

    const update = (patch: Partial<SessionEditForm>) => {
        setForm((prev) => ({ ...prev, ...patch }));
    };

    const handleClose = () => {
        setForm(sessionToForm(session));
        onClose();
    };

    const handleSubmit = () => {};

    // ── 렌더 ───────────────────────────────────────────────────────────────

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="수업 편집">
            <main className="p-5 bg-gray-1 w-full flex-1">
                <div className="w-full flex flex-col gap-5 p-4 rounded-lg bg-white pb-28">
                    {/* 교시 + 강의실 */}
                    <div className="w-full flex items-center gap-4">
                        <FormField label="교시" className="flex-1">
                            <Dropdown
                                variant="primary"
                                selectedLabel={form.periodNumber !== '' ? `${form.periodNumber}교시` : '선택'}
                                items={PERIOD_ITEMS}
                                onSelect={(id) => update({ periodNumber: Number(id) })}
                            />
                        </FormField>
                        <FormField label="강의실" className="flex-1">
                            <Dropdown
                                variant="primary"
                                selectedLabel={form.classroomId !== '' ? `${form.classroomId}호` : '선택'}
                                items={CLASSROOM_ITEMS}
                                onSelect={(id) => update({ classroomId: Number(id) })}
                            />
                        </FormField>
                    </div>

                    {/* 선생님 */}
                    <FormField label="선생님">
                        <TeacherCombobox
                            value={form.teacherName}
                            onSelect={(teacher) => update({ teacherName: teacher.name })}
                        />
                    </FormField>

                    {/* 수업명 + 반 */}
                    <div className="w-full flex flex-col gap-4">
                        <FormField label="수업명">
                            <Input
                                placeholder="ex) 국어(독서)"
                                value={form.subject}
                                onChange={(e) => update({ subject: e.target.value })}
                            />
                        </FormField>
                        <FormField label="반">
                            <Input
                                placeholder="ex) S"
                                value={form.group}
                                onChange={(e) => update({ group: e.target.value })}
                            />
                        </FormField>
                    </div>

                    {/* 현강생 + 인강생 */}
                    <div className="w-full flex items-center gap-4">
                        <FormField label="현강생" className="flex-1">
                            <Input
                                type="number"
                                min={0}
                                value={form.inPersonCount}
                                onChange={(e) => update({ inPersonCount: Number(e.target.value) })}
                            />
                        </FormField>
                        <FormField label="인강생" className="flex-1">
                            <Input
                                type="number"
                                min={0}
                                value={form.onlineCount}
                                onChange={(e) => update({ onlineCount: Number(e.target.value) })}
                            />
                        </FormField>
                    </div>
                </div>

                {/* 저장 버튼 */}
                <div className="mt-5">
                    <Button variant="primary" size="lg" onClick={handleSubmit} className="w-full">
                        저장
                    </Button>
                </div>
            </main>
        </Modal>
    );
}
