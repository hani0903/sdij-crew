import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
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
export default function TeacherDeleteWarningModal({
    isOpen,
    onClose,
    title,
    children,
    closeOnBackdropClick = true,
    size = 'md',
}: ModalProps) {
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
        closeBtnRef.current?.focus();
    }, []);

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 백드롭 영역(자기 자신) 직접 클릭 시에만 닫기
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
                'fixed inset-0 z-50',
                'flex items-center justify-center',
                'transition-colors duration-300',
                'bg-black/50',
            )}
            onClick={handleWrapperClick}
        >
            {/* 모달 패널
                모바일: w-full h-full → 전체 화면 시트
                데스크톱: max-w 제한 + 둥근 모서리 + 그림자 → 다이얼로그 */}
            <div
                className={cn(
                    'relative bg-white flex flex-col',
                    'h-auto max max-h-[85vh] w-[80dvw] rounded-2xl shadow-2xl',
                    DESKTOP_MAX_WIDTH[size],
                    'transition-all duration-300 ease-out',
                    'translate-y-0 opacity-100 md:scale-100',
                )}
            >
                {/* 본문 — 내부 스크롤 지원 */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
