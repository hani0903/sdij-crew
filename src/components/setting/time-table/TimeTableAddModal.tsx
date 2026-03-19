import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import type { ClassSessionStatus, ExtractedClassSession } from '@/types/schedule/classSession.type';
import Dropdown from '@/components/ui/dropdown';
import Input from '@/components/ui/Input/Input';
import { useCreateClassSessions } from '@/hooks/queries/useCreateClassSessions';
import PERIOD from '@/constants/period';
import CLASS_ROOMS from '@/constants/classes';
import TeacherCombobox from '@/components/setting/teachers/TeacherCombobox';
import FormField from '@/components/ui/FormField';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button/Button';
import { CameraIcon } from 'lucide-react';
import ImageScanModal from '@/components/setting/time-table/ImageScanModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    /** WeekDayBar에서 선택된 날짜*/
    date: Date;
}

/**
 * 폼 입력값 타입
 * - periodNumber, classroomId: 드롭다운 미선택 상태를 '' 로 표현 → 제출 전 number로 변환
 * - teacherId: 추후 인증 컨텍스트 연동 예정, 현재는 임시값 사용
 */
interface ClassSessionForm {
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

/** 새 카드 초기 상태 — 추가 버튼 클릭 시 이 값으로 배열에 삽입 */
const createInitialFormState = (): ClassSessionForm => ({
    periodNumber: '',
    classroomId: '',
    teacherName: '',
    subject: '',
    group: '',
    inPersonCount: 0,
    onlineCount: 0,
    classStatus: 'NORMAL',
});

/** 교시 드롭다운 항목 — constants/period.ts 기반으로 생성 (number → "N교시" 표시) */
const PERIOD_ITEMS = PERIOD.map((periodNumber) => ({
    id: String(periodNumber),
    title: `${periodNumber}교시`,
}));

/** 강의실 드롭다운 항목 — constants/classes.ts 기반으로 생성 (number → "N호" 표시) */
const CLASSROOM_ITEMS = CLASS_ROOMS.map((roomNumber) => ({
    id: String(roomNumber),
    title: `${roomNumber}호`,
}));

// ─── 유틸 ──────────────────────────────────────────────────────────────────

/**
 * Date → 'YYYY-MM-DD' 문자열 변환 (서버 요청용)
 * date-fns 미사용 환경에서 직접 포맷
 */
function toDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Date → 'M월 D일' 한국어 포맷 (모달 타이틀용)
 * date-fns 미사용 환경에서 toLocaleDateString 활용
 */
function formatKoreanDate(date: Date): string {
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'narrow' });
}

// ─── 유효성 검사 ────────────────────────────────────────────────────────────

/**
 * 단일 폼 항목의 필수 필드 검증
 * - periodNumber, classroomId, subject, group 이 비어있으면 false 반환
 */
function isFormItemValid(item: ClassSessionForm): boolean {
    return item.periodNumber !== '' && item.classroomId !== '' && item.subject.trim() !== '';
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────────

export default function TimeTableAddModal({ isOpen, onClose, date }: Props) {
    // 수업 카드 목록 상태 — 초기값은 카드 1개
    const [enteredClasses, setEnteredClasses] = useState<ClassSessionForm[]>([createInitialFormState()]);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);

    // 수업 제출 api 훅
    const { mutate: createSessions, isPending } = useCreateClassSessions();

    // ── 핸들러 ─────────────────────────────────────────────────────────────

    /** 특정 인덱스의 폼 필드 부분 업데이트 */
    const updateCard = (idx: number, patch: Partial<ClassSessionForm>) => {
        setEnteredClasses((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
    };

    /** 새 수업 카드 추가 — 같은 날짜, 다른 교시 입력용 */
    const handleAddCard = () => {
        setEnteredClasses((prev) => [...prev, createInitialFormState()]);
    };

    /** 특정 인덱스의 수업 카드 삭제 */
    const handleRemoveCard = (idx: number) => {
        setEnteredClasses((prev) => prev.filter((_, i) => i !== idx));
    };

    /**
     * AI 추출 결과를 폼 카드 목록에 반영.
     * 기존 카드가 초기 상태(빈 폼) 하나뿐이면 교체, 아니면 뒤에 추가하지 않고 일단 교체!
     */
    const handleExtracted = (sessions: ExtractedClassSession[]) => {
        // const isOnlyEmptyCard =
        //     enteredClasses.length === 1 && enteredClasses[0].subject === '' && enteredClasses[0].group === '';

        const newCards: ClassSessionForm[] = sessions.map((s) => ({
            // period: "1" 같은 문자열 → number. parseInt 실패 시 '' 로 미선택 처리
            periodNumber: parseInt(s.period, 10) || '',
            // roomName: "601호" 같은 문자열 → parseInt로 숫자 추출
            classroomId: parseInt(s.roomName, 10) || '',
            teacherName: s.teacherName,
            subject: s.className,
            group: s.classSection,
            inPersonCount: s.offlineStudentCount,
            onlineCount: s.onlineStudentCount,
            // 서버 응답에 classStatus 없음 → NORMAL 기본값
            classStatus: 'NORMAL' as const,
        }));

        setEnteredClasses(newCards);
    };

    /** 모달 닫힘 시 폼 상태 초기화 */
    const handleClose = () => {
        setEnteredClasses([createInitialFormState()]);
        onClose();
    };

    /**
     * 제출 핸들러
     * - 유효성 검사 통과 시 bulk POST 호출
     * - teacherId는 추후 인증 컨텍스트로 교체 예정 (현재 임시값 0 사용)
     */
    const handleSubmit = () => {
        // 모든 카드가 유효한지 검사
        const allValid = enteredClasses.every(isFormItemValid);
        if (!allValid) {
            // TODO: 토스트 라이브러리 도입 후 교체
            toast.error('필수 항목(교시, 강의실, 수업명)을 모두 입력해주세요.');
            return;
        }

        const dateString = toDateString(date);

        createSessions(
            {
                sessions: enteredClasses.map((item) => ({
                    periodNumber: item.periodNumber as number,
                    classroomId: (item.classroomId as number) % 600,
                    teacherName: item.teacherName,
                    subject: item.subject,
                    group: item.group,
                    inPersonCount: item.inPersonCount,
                    onlineCount: item.onlineCount,
                    classStatus: item.classStatus,
                    date: dateString,
                })),
            },
            {
                onSuccess: () => {
                    toast.success(' 수업이 성공적으로 추가되었습니다.');
                    handleClose();
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
        );
    };

    // ── 렌더 ───────────────────────────────────────────────────────────────

    const modalTitle = `${formatKoreanDate(date)} 수업 추가`;

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
                <main className="p-5 bg-gray-1 w-full flex-1">
                    <div className="flex flex-col gap-5 w-full pb-28">
                        <div className="w-full flex flex-col rounded-lg p-6 bg-linear-150 from-[#5D5FEF] to-[#8B8DFA] gap-2 text-white">
                            <h2 className=" font-bold text-lg">빠르게 오늘 수업을 추가해보세요!</h2>
                            <p className="text-[#E0E7FF] text-sm break-keep">
                                잔디에서 다운받은 시간표를{' '}
                                <u className="underline-offset-3 text-[#ffc4c4]">요일별로 잘라 넣으면</u> 자동으로
                                시간표를 만들어줘요!
                            </p>
                            <div className="p-2 rounded-lg bg-white/40 text-xs flex gap-2 break-keep">
                                <span>❗</span>사진이 커지면 AI의 정확도가 낮아지므로 반드시 요일별로 잘라 넣어주세요.
                            </div>
                            <Button
                                variant={'secondary'}
                                size={'lg'}
                                className="mt-2 text-point flex gap-3 items-center"
                                onClick={() => setIsScanModalOpen(true)}
                            >
                                <CameraIcon /> <span>사진 스캔하기</span>
                            </Button>
                        </div>
                        {/* 수업 카드 목록 */}
                        <ul className="w-full flex flex-col gap-4">
                            {enteredClasses.map((enteredClass, idx) => (
                                <li key={idx} className="w-full flex flex-col gap-5 p-4 rounded-lg bg-white">
                                    {/* 카드 헤더 — 카드 번호 + 삭제 버튼 (카드가 1개일 때는 숨김) */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-point">수업 {idx + 1}</span>
                                        {enteredClasses.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCard(idx)}
                                                className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded"
                                                aria-label={`${idx + 1}번째 수업 카드 삭제`}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>

                                    {/* 교시 + 강의실 */}
                                    <div className="w-full flex items-center gap-4">
                                        <FormField label="교시" className="flex-1">
                                            <Dropdown
                                                variant="primary"
                                                selectedLabel={
                                                    enteredClass.periodNumber !== ''
                                                        ? `${enteredClass.periodNumber}교시`
                                                        : '선택'
                                                }
                                                items={PERIOD_ITEMS}
                                                onSelect={(id) => updateCard(idx, { periodNumber: Number(id) })}
                                            />
                                        </FormField>
                                        <FormField label="강의실" className="flex-1">
                                            <Dropdown
                                                variant="primary"
                                                selectedLabel={
                                                    enteredClass.classroomId !== ''
                                                        ? `${enteredClass.classroomId}호`
                                                        : '선택'
                                                }
                                                items={CLASSROOM_ITEMS}
                                                onSelect={(id) => updateCard(idx, { classroomId: Number(id) })}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="선생님">
                                        <TeacherCombobox
                                            value={enteredClass.teacherName || ''}
                                            onSelect={(teacher) => updateCard(idx, { teacherName: teacher.name })}
                                        />
                                    </FormField>

                                    {/* 수업명 + 반 */}
                                    <div className="w-full flex flex-col gap-4">
                                        <FormField label="수업명">
                                            <Input
                                                placeholder="ex) 국어(독서)"
                                                value={enteredClass.subject}
                                                onChange={(e) => updateCard(idx, { subject: e.target.value })}
                                            />
                                        </FormField>
                                        <FormField label="반">
                                            <Input
                                                placeholder="ex) S"
                                                value={enteredClass.group}
                                                onChange={(e) => updateCard(idx, { group: e.target.value })}
                                            />
                                        </FormField>
                                    </div>

                                    {/* 현강생 + 인강생 */}
                                    <div className="w-full flex items-center gap-4">
                                        <FormField label="현강생" className="flex-1">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={enteredClass.inPersonCount}
                                                onChange={(e) =>
                                                    updateCard(idx, {
                                                        inPersonCount: Number(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormField>
                                        <FormField label="인강생" className="flex-1">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={enteredClass.onlineCount}
                                                onChange={(e) =>
                                                    updateCard(idx, {
                                                        onlineCount: Number(e.target.value),
                                                    })
                                                }
                                            />
                                        </FormField>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* 하단 버튼 영역 — 모달 본문 흐름에 포함 (스크롤 가능) */}
                        <div className="flex flex-col gap-3">
                            {/* 새 수업 카드 추가 버튼 */}
                            <div className="w-full flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={handleAddCard}
                                    className="w-full border-point/30 border-2 border-dashed rounded-lg text-point bg-white"
                                >
                                    새로운 수업 추가하기
                                </Button>
                            </div>

                            {/* 제출 버튼 */}
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="w-full"
                            >
                                {isPending ? '추가 중...' : '추가'}
                            </Button>
                        </div>
                    </div>
                </main>
            </Modal>

            <ImageScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onExtracted={handleExtracted}
            />
        </>
    );
}
