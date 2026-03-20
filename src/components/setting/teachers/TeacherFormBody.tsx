import Dropdown from '@/components/ui/dropdown';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input/Input';
import { ChevronDownIcon, EraserIcon, MailIcon, MicIcon, MonitorCheckIcon, PencilLineIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/libs/cn';
import { Switch } from '@/components/ui/ToggleSwitch';
import EmailInput from '@/components/ui/form/EmailInput';
import type { TeacherSetting } from '@/types/teacher/teacher.type';

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

// ─── TeacherFormBody — 폼 필드만 담당하는 순수 프레젠테이션 컴포넌트 ──────────

/** TeacherFormBody가 관리하는 폼 데이터 형태 */
export interface TeacherFormValue {
    name: string;
    chalkType: TeacherSetting['chalkType'];
    chalkDetail: string;
    eraserDetail?: string;
    micType: TeacherSetting['micType'];
    hasPpt: boolean;
    notes?: string;
    email?: string;
}

interface TeacherFormBodyProps {
    value: TeacherFormValue;
    onChange: (next: TeacherFormValue) => void;
}

type ExpandedSection = 'chalk' | 'eraser' | 'mic' | 'email' | null;

export function TeacherFormBody({ value, onChange }: TeacherFormBodyProps) {
    const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);

    const toggleSection = (section: Exclude<ExpandedSection, null>) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    // 이메일 preview — '@'가 포함된 완전한 이메일이면 표시, 없으면 "미설정"
    const emailPreview = value.email?.includes('@') ? value.email : '미설정';

    return (
        <main className="w-full flex flex-col p-5 gap-4">
            {/* 이름 */}
            <FormField label="이름" htmlFor="teacher-name">
                <Input
                    id="teacher-name"
                    type="text"
                    value={value.name}
                    onChange={(e) => onChange({ ...value, name: e.target.value })}
                />
            </FormField>

            {/* 분필 세팅 */}
            <AccordionSection
                icon={<PencilLineIcon className="size-4 text-[#475569]" />}
                title="분필 세팅"
                preview={chalkTypeLabel(value.chalkType)}
                isOpen={expandedSection === 'chalk'}
                onToggle={() => toggleSection('chalk')}
            >
                <FormField label="분필 종류" htmlFor="chalk-type">
                    <Dropdown
                        className="w-[50%]"
                        selectedLabel={CHALK_ITEMS.find((item) => item.id === value.chalkType)?.title ?? ''}
                        items={CHALK_ITEMS}
                        variant="primary"
                        onSelect={(id) =>
                            onChange({
                                ...value,
                                chalkType: id as TeacherSetting['chalkType'],
                            })
                        }
                    />
                </FormField>
                <FormField label="분필 상세 메모" htmlFor="chalk-detail">
                    <textarea
                        id="chalk-detail"
                        value={value.chalkDetail}
                        onChange={(e) => onChange({ ...value, chalkDetail: e.target.value })}
                        className="w-full p-2 text-sm text-[#94A3B8] border border-gray-200 bg-gray-100 rounded-xl focus:border-point/10 outline-none resize-none"
                        rows={3}
                    />
                </FormField>
            </AccordionSection>

            {/* 지우개 세팅 — 상세 메모 글자 수를 preview로 표시 */}
            <AccordionSection
                icon={<EraserIcon className="size-4 text-[#475569]" />}
                title="지우개 세팅"
                preview={value.eraserDetail ? `${value.eraserDetail.length}자` : undefined}
                isOpen={expandedSection === 'eraser'}
                onToggle={() => toggleSection('eraser')}
            >
                <FormField label="지우개 상세 메모" htmlFor="eraser-detail">
                    <textarea
                        id="eraser-detail"
                        value={value.eraserDetail ?? ''}
                        onChange={(e) => onChange({ ...value, eraserDetail: e.target.value })}
                        className="w-full p-2 text-sm text-[#94A3B8] border border-gray-200 bg-gray-100 rounded-xl focus:border-point/10 outline-none resize-none"
                        rows={3}
                    />
                </FormField>
            </AccordionSection>

            {/* 마이크 세팅 */}
            <AccordionSection
                icon={<MicIcon className="size-4 text-[#475569]" />}
                title="마이크 세팅"
                preview={micTypeLabel(value.micType)}
                isOpen={expandedSection === 'mic'}
                onToggle={() => toggleSection('mic')}
            >
                <FormField label="마이크 타입" htmlFor="mic-type">
                    <Dropdown
                        className="w-[50%]"
                        selectedLabel={MIC_ITEMS.find((item) => item.id === value.micType)?.title ?? ''}
                        items={MIC_ITEMS}
                        variant="primary"
                        onSelect={(id) =>
                            onChange({
                                ...value,
                                micType: id as TeacherSetting['micType'],
                            })
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
                        value={value.email || ''}
                        onChange={(fullEmail) => onChange({ ...value, email: fullEmail })}
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
                        value.hasPpt ? 'bg-point/10 text-point' : 'bg-gray-100 text-gray-400',
                    )}
                >
                    {value.hasPpt ? '사용' : '미사용'}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                    <Switch
                        checked={value.hasPpt}
                        onCheckedChange={(checked) => onChange({ ...value, hasPpt: checked })}
                    />
                </div>
            </div>
        </main>
    );
}
