import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import type { ClassSession } from '@/types/schedule/classSession.type';
import Dropdown from '@/components/ui/dropdown';
import Input from '@/components/ui/Input';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// 폼 입력값의 타입
type ClassSessionForm = Omit<ClassSession, 'periodNumber' | 'classroomId' | 'teacherId'> & {
    periodNumber: number | '';
    classroomId: number | '';
    teacherId: number | '';
};

const initialFormState: ClassSessionForm = {
    date: new Date().toISOString().split('T')[0],
    periodNumber: '',
    classroomId: '',
    teacherId: '',
    subject: '',
    group: '',
    inPersonCount: 0,
    onlineCount: 0,
    classStatus: 'NORMAL',
};

export default function TimeTableAddModal({ isOpen, onClose }: Props) {
    // 폼 입력값 상태 — 입력 필드 연결 시 _접두사 제거 후 사용
    const [enteredClasses, setEnteredClasses] = useState<ClassSessionForm[]>([initialFormState]);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="수업 추가">
            <div className="relative flex flex-col gap-5 w-full h-full bg-gray-1 p-4">
                <ul className="w-full flex flex-col gap-4 ">
                    {enteredClasses.map((enteredClass, idx) => (
                        <li className="w-full flex flex-col gap-5 p-4 rounded-lg bg-white">
                            <div className="w-full flex items-center gap-4">
                                <FormField label="교시" className="flex-1">
                                    <Dropdown
                                        variant={'primary'}
                                        selectedLabel={enteredClass.periodNumber.toString() || '1'}
                                        items={[
                                            { id: '1', title: '1교시' },
                                            { id: '2', title: '2교시' },
                                            { id: '3', title: '3교시' },
                                            { id: '4', title: '4교시' },
                                            { id: '5', title: '5교시' },
                                        ]}
                                        onSelect={(id) => {
                                            setEnteredClasses((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx ? { ...item, periodNumber: Number(id) } : item,
                                                ),
                                            );
                                        }}
                                    />
                                </FormField>
                                <FormField label="강의실" className="flex-1">
                                    <Dropdown
                                        variant={'primary'}
                                        selectedLabel={enteredClass.classroomId.toString() || '601'}
                                        items={[
                                            { id: '601', title: '601호' },
                                            { id: '602', title: '602호' },
                                            { id: '603', title: '603호' },
                                            { id: '604', title: '604호' },
                                            { id: '605', title: '605호' },
                                            { id: '606', title: '606호' },
                                            { id: '607', title: '607호' },
                                            { id: '608', title: '608호' },
                                        ]}
                                        onSelect={(id) => {
                                            setEnteredClasses((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx ? { ...item, classroomId: Number(id) } : item,
                                                ),
                                            );
                                        }}
                                    />
                                </FormField>
                            </div>

                            <div className="w-full flex flex-col gap-4">
                                <FormField label="수업명" className="flex-1">
                                    <Input placeholder="ex) 국어(독서)" />
                                </FormField>

                                <FormField label="반" className="flex-1">
                                    <Input placeholder="ex) S" />
                                </FormField>
                            </div>

                            <div className="w-full flex items-center gap-4">
                                <FormField label="현강생" className="flex-1">
                                    <Input type="number" className="inline-block" />
                                </FormField>

                                <FormField label="인강생" className="flex-1">
                                    <Input type="number" />
                                </FormField>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* 하단 버튼 영역 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex flex-col gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="border-point/30 border-2 border-dashed rounded-lg text-point bg-white"
                    >
                        새로운 수업 추가하기
                    </Button>
                    <Button variant="primary" size="sm" onClick={onClose}>
                        추가
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ─── 내부 헬퍼 컴포넌트 ─────────────────────────────────────────────────────

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

/** 라벨 + 입력 필드 묶음 — 이 모달 내부에서만 사용 */
function FormField({ label, children, className }: FormFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
            <label className="text-sm font-medium text-gray-4">{label}</label>
            {children}
        </div>
    );
}
