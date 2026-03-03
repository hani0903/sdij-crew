/**
 * Button 컴포넌트
 *
 * [설계 원칙]
 * - cva(class-variance-authority)로 variant/size 조합을 타입 안전하게 관리
 * - cn(clsx + tailwind-merge)으로 외부 className과 충돌 없이 병합
 * - forwardRef로 ref를 외부에 노출 → 포커스 제어, 애니메이션 등 활용 가능
 * - React.ButtonHTMLAttributes 완전 상속 → onClick, type, form, aria-* 등 모두 사용 가능
 * - label prop 하위 호환 유지 + children도 함께 지원
 *   우선순위: children > label (명시적 children이 있으면 children을 렌더링)
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/libs/cn';

// ─── variant / size 스타일 정의 ────────────────────────────────────────────
//
// [왜 cva를 쓰나?]
// Record<Variant, string> 패턴 대비 cva는:
// 1. variant + size 조합을 선언적으로 한 곳에 모을 수 있다
// 2. VariantProps<typeof buttonVariants>로 타입이 자동 추론된다
// 3. compoundVariants로 특정 조합에만 적용되는 스타일을 따로 선언할 수 있다
//
const buttonVariants = cva(
    // 기본(base) 클래스 — 모든 variant에 공통 적용
    [
        'inline-flex items-center justify-center',
        'font-pretendard font-medium',
        'transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-point focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
    ],
    {
        variants: {
            /**
             * variant: 버튼의 시각적 역할(강조도)을 결정한다.
             * - primary  : 핵심 액션 (화면에 1개 권장)
             * - secondary: 보조 액션
             * - ghost    : 외곽선만 있는 최소 강조 버튼
             */
            variant: {
                primary: [
                    'bg-point text-white',
                    'hover:opacity-90 active:opacity-80',
                    // disabled 상태: opacity가 아닌 배경색으로 표현 (디자인 의도 유지)
                    'disabled:bg-gray-3 disabled:text-white disabled:opacity-100',
                ],
                secondary: ['bg-gray-1 text-black', 'hover:bg-gray-2 active:bg-gray-2', 'disabled:opacity-40'],
                ghost: [
                    'bg-transparent border border-gray-3 text-black',
                    'hover:bg-gray-1 active:bg-gray-2',
                    'disabled:opacity-40',
                ],
            },
            /**
             * size: 버튼의 물리적 크기(패딩, 폰트, 모서리)를 결정한다.
             */
            size: {
                sm: 'text-sm font-medium px-5 py-3 rounded-md',
                md: 'text-md font-medium px-8 py-[18px] rounded-md',
                lg: 'text-lg px-6 py-3 rounded-xl',
            },
        },
        // 기본값 — 사용처에서 variant/size를 생략해도 동작하도록
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

// ─── Props 타입 ────────────────────────────────────────────────────────────
//
// ButtonHTMLAttributes를 상속하면:
//   onClick, type, disabled, form, name, value, aria-*, data-* 등 네이티브 속성 전부 허용
//
// Omit<ButtonHTMLAttributes<...>, 'children'>으로 children을 재선언해
//   React.ReactNode 타입으로 명시적으로 허용한다.
//
// label?: string  — 기존 사용처 하위 호환을 위해 유지
//   children이 있으면 children 우선, 없으면 label을 렌더링한다.
//

export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>, VariantProps<typeof buttonVariants> {
    /** @deprecated children 사용을 권장합니다. 기존 사용처 하위 호환용으로 유지됩니다. */
    label?: string;
    /** 버튼 내부 콘텐츠 — 텍스트, 아이콘 등 자유롭게 구성 */
    children?: React.ReactNode;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────

/**
 * 디자인 시스템 버튼 프리미티브.
 *
 * @example 기존 방식 (하위 호환)
 * ```tsx
 * <Button label="확인" variant="primary" size="md" onClick={handleSubmit} />
 * ```
 *
 * @example 권장 방식 (children)
 * ```tsx
 * <Button variant="ghost" size="sm" onClick={handleCancel}>
 *   취소
 * </Button>
 * ```
 *
 * @example 아이콘 조합
 * ```tsx
 * <Button variant="primary">
 *   <PlusIcon className="w-4 h-4" />
 *   추가하기
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, label, children, ...props }, ref) => {
        return (
            <button
                // type 미지정 시 form 내부에서 submit이 의도치 않게 발동될 수 있으므로 기본값 명시
                type="button"
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            >
                {/* children이 있으면 children 우선, 없으면 label 폴백 */}
                {children ?? label}
            </button>
        );
    },
);

Button.displayName = 'Button';

// ─── 내보내기 ──────────────────────────────────────────────────────────────
//
// named export(buttonVariants)를 함께 제공해 외부에서 스타일만 재사용할 수 있도록 한다.
// 예) <a className={cn(buttonVariants({ variant: 'primary' }), '...')} />
//
export { buttonVariants };
export default Button;
