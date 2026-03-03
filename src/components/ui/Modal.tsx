import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/libs/cn';

// ─── 타입 ──────────────────────────────────────────────────────────────────

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** 모달 상단 제목 (없으면 헤더 타이틀 영역 비움) */
    title?: string;
    children: React.ReactNode;
    /** 배경 클릭으로 닫기 여부 (기본값: true) */
    closeOnBackdropClick?: boolean;
    /** 데스크톱에서의 최대 너비 프리셋 (기본값: 'md') */
    size?: 'sm' | 'md' | 'lg';
}

// ─── 상수 ──────────────────────────────────────────────────────────────────

/** 데스크톱 크기별 max-width 매핑 */
const DESKTOP_MAX_WIDTH: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-lg',
    lg: 'md:max-w-2xl',
};

/** 애니메이션 트랜지션 지속 시간 (ms) — CSS duration과 반드시 동기화 */
const ANIMATION_DURATION_MS = 300;

// ─── 훅 ────────────────────────────────────────────────────────────────────

/**
 * 모달 마운트/언마운트 타이밍을 분리해 CSS exit 애니메이션을 보장하는 훅.
 *
 * - `mounted`: DOM에 존재 여부 (isOpen이 false가 돼도 애니메이션이 끝날 때까지 유지)
 * - `visible`: CSS transition의 트리거 (transform/opacity 클래스 결정)
 */
function useModalAnimation(isOpen: boolean) {
    const [mounted, setMounted] = useState(isOpen);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // setTimeout(0): 브라우저 paint 사이클 이후 transition 시작 보장
            const timer = setTimeout(() => setVisible(true), 0);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
            // transition이 끝난 뒤 DOM에서 제거
            const timer = setTimeout(() => setMounted(false), ANIMATION_DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return { mounted, visible };
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────────

/**
 * 범용 모달 컴포넌트
 *
 * [반응형 동작]
 * - 모바일 (<768px): 전체 화면을 덮는 시트 (아래서 슬라이드업)
 * - 데스크톱 (≥768px): 배경 오버레이 위 중앙 다이얼로그 (페이드 + 스케일)
 *
 * [접근성]
 * - role="dialog" + aria-modal="true"
 * - ESC 키로 닫기
 * - 열릴 때 닫기 버튼 자동 포커스
 * - 열린 동안 body 스크롤 잠금
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    closeOnBackdropClick = true,
    size = 'md',
}: ModalProps) {
    const { mounted, visible } = useModalAnimation(isOpen);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // ESC 키 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // 모달이 열린 동안 body 스크롤 잠금
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    // 열릴 때 닫기 버튼에 포커스 (접근성 — 포커스 트랩의 시작점)
    useEffect(() => {
        if (visible) closeBtnRef.current?.focus();
    }, [visible]);

    if (!mounted) return null;

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 백드롭 영역(자기 자신) 직접 클릭 시에만 닫기
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
                'fixed inset-0 z-50',
                // 데스크톱: 중앙 정렬 컨테이너 + 배경 오버레이
                'md:flex md:items-center md:justify-center',
                'transition-colors duration-300',
                visible ? 'md:bg-black/50' : 'md:bg-black/0',
            )}
            onClick={handleWrapperClick}
        >
            {/* 모달 패널
                모바일: w-full h-full → 전체 화면 시트
                데스크톱: max-w 제한 + 둥근 모서리 + 그림자 → 다이얼로그 */}
            <div
                className={cn(
                    'relative bg-white flex flex-col',
                    'w-full h-full',
                    'md:h-auto md:max-h-[85vh] md:rounded-2xl md:shadow-2xl',
                    DESKTOP_MAX_WIDTH[size],
                    // 애니메이션:
                    //   모바일 — translate-y-full(하단 이탈) ↔ translate-y-0
                    //   데스크톱 — opacity+scale ↔ 1 (translate 없음)
                    'transition-all duration-300 ease-out',
                    visible
                        ? 'translate-y-0 opacity-100 md:scale-100'
                        : 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95',
                )}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-2 shrink-0">
                    {title ? (
                        <h2 className="text-xl font-bold">{title}</h2>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-1 transition-colors"
                        aria-label="모달 닫기"
                    >
                        <X size={20} className="text-gray-4" />
                    </button>
                </div>

                {/* 본문 — 내부 스크롤 지원 */}
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
