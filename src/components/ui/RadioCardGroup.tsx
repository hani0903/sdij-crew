// ─── RadioCardGroup ───────────────────────────────────────────────────────────
//
// 역할: 아이콘 + 제목 + 설명이 포함된 카드형 라디오 버튼 그룹.
//
// 설계 결정:
//   - <fieldset> + <legend> 사용: 단일 input이 아닌 그룹을 레이블링할 때는
//     <div> + <label>(<FormField>) 대신 올바른 HTML 시맨틱을 사용해야 한다.
//   - legend 스타일은 FormField의 label과 동일한 클래스(text-sm font-medium text-gray-4)를
//     직접 적용. 현재 단계에서 FieldLabel 프리미티브 추출은 오버엔지니어링이다.
//   - checked 상태를 CSS peer 트릭이 아닌 React prop으로 처리:
//     controlled input 환경에서는 JS 상태가 이미 있으므로 더 명확하다.

import { cn } from '@/libs/cn';
import { CheckIcon } from 'lucide-react';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export interface RadioCardOption<T extends string> {
    value: T;
    label: string;
    description?: string;
    /** 카드 좌측 아이콘 영역에 렌더링할 노드 */
    icon?: React.ReactNode;
}

interface RadioCardGroupProps<T extends string> {
    /** fieldset의 접근성 레이블 — FormField의 label과 동일한 스타일로 표시 */
    legend: string;
    /** 라디오 그룹의 name 속성 (폼 전송 시 사용) */
    name: string;
    /** 현재 선택된 값 */
    value: T | undefined;
    onChange: (value: T) => void;
    options: RadioCardOption<T>[];
    className?: string;
}

// ─── RadioCardGroup ───────────────────────────────────────────────────────────

export function RadioCardGroup<T extends string>({
    legend,
    name,
    value,
    onChange,
    options,
    className,
}: RadioCardGroupProps<T>) {
    return (
        <fieldset className={cn('flex flex-col gap-1.5', className)}>
            <legend className="text-sm font-medium text-gray-4 mb-1">{legend}</legend>
            <div className="flex flex-col gap-2">
                {options.map((option) => (
                    <RadioCard
                        key={option.value}
                        id={`radio-${name}-${option.value}`}
                        name={name}
                        option={option}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                ))}
            </div>
        </fieldset>
    );
}

// ─── RadioCard (내부 컴포넌트) ────────────────────────────────────────────────

interface RadioCardProps<T extends string> {
    id: string;
    name: string;
    option: RadioCardOption<T>;
    checked: boolean;
    onChange: () => void;
}

function RadioCard<T extends string>({ id, name, option, checked, onChange }: RadioCardProps<T>) {
    return (
        <label
            htmlFor={id}
            className={cn(
                'flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all select-none',
                checked ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-100',
            )}
        >
            {/* 숨겨진 실제 input — 접근성 및 폼 전송용 */}
            <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />

            {/* 아이콘 영역 */}
            {option.icon != null && (
                <div className="flex items-center justify-center size-12 bg-indigo-100 rounded-xl mr-4 shrink-0">
                    {option.icon}
                </div>
            )}

            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{option.label}</p>
                {option.description != null && <p className="text-sm text-gray-400 truncate">{option.description}</p>}
            </div>

            {/* 선택 인디케이터 */}
            <RadioIndicator checked={checked} />
        </label>
    );
}

// ─── RadioIndicator (내부 컴포넌트) ──────────────────────────────────────────

function RadioIndicator({ checked }: { checked: boolean }) {
    return (
        <div
            className={cn(
                'shrink-0 size-6 border-2 rounded-full flex items-center justify-center ml-3 transition-colors',
                checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-200',
            )}
        >
            {/* 체크마크: checked일 때만 표시 */}
            {checked && <CheckIcon className="text-white size-[80%]" />}
        </div>
    );
}
