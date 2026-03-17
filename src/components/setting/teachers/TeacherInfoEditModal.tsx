import Dropdown from '@/components/ui/dropdown';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { TeacherSetting } from '@/types/teacher/teacher.type';
import { ChevronDownIcon, EraserIcon, MailIcon, MicIcon, MonitorCheckIcon, PencilLineIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/libs/cn';
import { Switch } from '@/components/ui/ToggleSwitch';
import { useUpdateTeacher } from '@/hooks/queries/teacher/use-update-teacher';
import EmailInput from '@/components/ui/form/EmailInput';

// ─── 드롭다운 선택지 ──────────────────────────────────────────────────────────

const CHALK_ITEMS: { id: TeacherSetting['chalkType']; title: string }[] = [
    { id: 'ACADEMY', title: '학원 분필' },
    { id: 'PERSONAL', title: '개인 분필' },
    { id: 'MIXED', title: '혼합' },
];

const MIC_ITEMS: { id: TeacherSetting['micType']; title: string }[] = [
    { id: 'ACADEMY', title: '학원 마이크' },
    { id: 'PERSONAL', title: '개인 마이크' },
];

// ─── 분필 타입 → 한국어 레이블 변환 헬퍼 ─────────────────────────────────────

function chalkTypeLabel(type: TeacherSetting['chalkType']): string {
    const map: Record<TeacherSetting['chalkType'], string> = {
        ACADEMY: '학원 분필',
        PERSONAL: '개인 분필',
        MIXED: '혼합',
    };
    return map[type];
}

// ─── 마이크 타입 → 한국어 레이블 변환 헬퍼 ───────────────────────────────────

function micTypeLabel(type: TeacherSetting['micType']): string {
    const map: Record<TeacherSetting['micType'], string> = {
        ACADEMY: '학원 마이크',
        PERSONAL: '개인 마이크',
    };
    return map[type];
}

// ─── 아코디언 섹션 ────────────────────────────────────────────────────────────

interface AccordionSectionProps {
    icon: React.ReactNode;
    title: string;
    /** 아코디언이 닫혔을 때 헤더에 표시할 현재 값 미리보기 */
    preview?: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function AccordionSection({ icon, title, preview, isOpen, onToggle, children }: AccordionSectionProps) {
    return (
        <div className="w-full flex flex-col gap-3">
            {/* button 안에 블록 레벨 헤딩 태그를 넣으면 시맨틱 오류 — span으로 교체 */}
            <button type="button" onClick={onToggle} className="w-full flex items-center gap-2 cursor-pointer">
                <div className="p-2 size-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <span className="text-[#1E293B] font-semibold text-base">{title}</span>
                {/* 아코디언이 닫혀 있을 때 현재 설정값을 badge로 표시해 가시성 확보 */}
                {!isOpen && preview && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-point/10 text-point text-xs font-medium shrink-0">
                        {preview}
                    </span>
                )}
                <ChevronDownIcon
                    className={cn(
                        'size-4 text-[#475569] ml-auto transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>
            {isOpen && <div className="flex flex-col gap-3 pl-12">{children}</div>}
        </div>
    );
}

// ─── 선생님 정보 수정 모달 ────────────────────────────────────────────────────

type ExpandedSection = 'chalk' | 'eraser' | 'mic' | 'email' | null;

interface TeacherInfoEditModalProps {
    teacherData: TeacherSetting;
    isOpen: boolean;
    onClose: () => void;
}

export default function TeacherInfoEditModal({ teacherData, isOpen, onClose }: TeacherInfoEditModalProps) {
    // 폼 상태 — teacherData로 초기화
    const [formData, setFormData] = useState(teacherData);

    const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);

    const { mutate: updateTeacher, isPending } = useUpdateTeacher();

    const toggleSection = (section: Exclude<ExpandedSection, null>) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

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
                    // 빈 문자열은 null로 변환해 서버에 명시적으로 "값 없음"을 전달
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

    // 이메일 preview — '@'가 포함된 완전한 이메일이면 표시, 없으면 "미설정"
    const emailPreview = formData.email?.includes('@') ? formData.email : '미설정';

    return (
        <Modal title="선생님 정보 수정하기" isOpen={isOpen} onClose={onClose}>
            {/* 본문 스크롤 영역 */}
            <main className="w-full flex flex-col p-5 gap-4">
                {/* 이름 */}
                <FormField label="이름" htmlFor="teacher-name">
                    <Input
                        id="teacher-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </FormField>

                {/* 분필 세팅 */}
                <AccordionSection
                    icon={<PencilLineIcon className="size-4 text-[#475569]" />}
                    title="분필 세팅"
                    preview={chalkTypeLabel(formData.chalkType)}
                    isOpen={expandedSection === 'chalk'}
                    onToggle={() => toggleSection('chalk')}
                >
                    <FormField label="분필 종류" htmlFor="chalk-type">
                        <Dropdown
                            className="w-[50%]"
                            selectedLabel={CHALK_ITEMS.find((item) => item.id === formData.chalkType)?.title ?? ''}
                            items={CHALK_ITEMS}
                            variant="primary"
                            onSelect={(id) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    chalkType: id as TeacherSetting['chalkType'],
                                }))
                            }
                        />
                    </FormField>
                    <FormField label="분필 상세 메모" htmlFor="chalk-detail">
                        <textarea
                            id="chalk-detail"
                            value={formData.chalkDetail}
                            onChange={(e) => setFormData((prev) => ({ ...prev, chalkDetail: e.target.value }))}
                            className="w-full p-2 text-sm text-[#94A3B8] border border-gray-200 bg-gray-100 rounded-xl focus:border-point/10 outline-none resize-none"
                            rows={3}
                        />
                    </FormField>
                </AccordionSection>

                {/* 지우개 세팅 — 상세 메모 글자 수를 preview로 표시 */}
                <AccordionSection
                    icon={<EraserIcon className="size-4 text-[#475569]" />}
                    title="지우개 세팅"
                    preview={formData.eraserDetail ? `${formData.eraserDetail.length}자` : undefined}
                    isOpen={expandedSection === 'eraser'}
                    onToggle={() => toggleSection('eraser')}
                >
                    <FormField label="지우개 상세 메모" htmlFor="eraser-detail">
                        <textarea
                            id="eraser-detail"
                            value={formData.eraserDetail ?? ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, eraserDetail: e.target.value }))}
                            className="w-full p-2 text-sm text-[#94A3B8] border border-gray-200 bg-gray-100 rounded-xl focus:border-point/10 outline-none resize-none"
                            rows={3}
                        />
                    </FormField>
                </AccordionSection>

                {/* 마이크 세팅 */}
                <AccordionSection
                    icon={<MicIcon className="size-4 text-[#475569]" />}
                    title="마이크 세팅"
                    preview={micTypeLabel(formData.micType)}
                    isOpen={expandedSection === 'mic'}
                    onToggle={() => toggleSection('mic')}
                >
                    <FormField label="마이크 타입" htmlFor="mic-type">
                        <Dropdown
                            className="w-[50%]"
                            selectedLabel={MIC_ITEMS.find((item) => item.id === formData.micType)?.title ?? ''}
                            items={MIC_ITEMS}
                            variant="primary"
                            onSelect={(id) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    micType: id as TeacherSetting['micType'],
                                }))
                            }
                        />
                    </FormField>
                </AccordionSection>

                {/* 이메일 정보 */}
                <AccordionSection
                    icon={<MailIcon className="size-4 text-[#475569]" />}
                    title="이메일 정보"
                    preview={emailPreview}
                    isOpen={expandedSection === 'email'}
                    onToggle={() => toggleSection('email')}
                >
                    <FormField label="이메일" htmlFor="email-local">
                        <EmailInput
                            value={formData.email || ''}
                            onChange={(fullEmail) => setFormData((prev) => ({ ...prev, email: fullEmail }))}
                        />
                    </FormField>
                </AccordionSection>

                {/* PPT 사용 — 다른 섹션과 시각적 스타일 통일 (인라인 row 유지) */}
                <div className="w-full flex items-center gap-2">
                    <div className="p-2 size-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                        <MonitorCheckIcon className="size-4 text-[#475569]" />
                    </div>
                    <span className="text-[#1E293B] font-semibold text-base">PPT 사용</span>
                    {/* 현재 상태를 badge로 표시 */}
                    <span
                        className={cn(
                            'ml-1 px-2 py-0.5 rounded-full text-xs font-medium',
                            formData.hasPpt ? 'bg-point/10 text-point' : 'bg-gray-100 text-gray-400',
                        )}
                    >
                        {formData.hasPpt ? '사용' : '미사용'}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        <Switch
                            checked={formData.hasPpt}
                            onCheckedChange={(checked) => {
                                setFormData((prev) => ({ ...prev, hasPpt: checked }));
                            }}
                        />
                    </div>
                </div>
            </main>

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
