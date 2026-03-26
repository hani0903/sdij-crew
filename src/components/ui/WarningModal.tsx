import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { FileWarningIcon } from 'lucide-react';
import { cn } from '@/libs/cn';

// ─── 타입 ──────────────────────────────────────────────────────────────────

export interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** 모달 제목 — 예: "정말 삭제하실건가요?" */
    title: string;
    /** 본문 설명 */
    description: string;
    /** 강조 텍스트 (선택) — text-point font-semibold 로 표시 */
    highlight?: string;
    /** 확인 버튼 레이블 (기본값: "삭제하기") */
    confirmLabel?: string;
    /** 확인 버튼 클릭 핸들러 */
    onConfirm: () => void;
    /** API 호출 중 버튼 비활성화 여부 */
    isLoading?: boolean;
}

// ─── 상수 ──────────────────────────────────────────────────────────────────

const ANIMATION_DURATION_MS = 300;

// ─── 훅 ────────────────────────────────────────────────────────────────────

function useModalAnimation(isOpen: boolean) {
    const [mounted, setMounted] = useState(isOpen);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            const timer = setTimeout(() => setVisible(true), 0);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
            const timer = setTimeout(() => setMounted(false), ANIMATION_DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return { mounted, visible };
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────────

/**
 * 범용 경고 확인 모달
 *
 * - FileWarningIcon + 빨간 원형 배경으로 위험성 시각화
 * - highlight prop으로 삭제 대상 등 강조 텍스트 표시
 * - isLoading 동안 버튼 비활성화
 */
export function WarningModal({
    isOpen,
    onClose,
    title,
    description,
    highlight,
    confirmLabel = '삭제하기',
    onConfirm,
    isLoading = false,
}: WarningModalProps) {
    const { mounted, visible } = useModalAnimation(isOpen);

    // ESC 키 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // 열린 동안 body 스크롤 잠금
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    if (!mounted) return null;

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center',
                'transition-colors duration-300',
                visible ? 'bg-black/50' : 'bg-black/0',
            )}
            onClick={handleWrapperClick}
        >
            <div
                className={cn(
                    'relative bg-white flex flex-col',
                    'w-[80dvw] max-w-sm rounded-2xl shadow-2xl',
                    'transition-all duration-300 ease-out',
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                )}
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col items-center gap-4">
                        {/* 아이콘 */}
                        <div className="flex items-center justify-center p-3 rounded-full bg-red-200 text-red-500">
                            <FileWarningIcon />
                        </div>

                        {/* 텍스트 영역 */}
                        <div className="flex flex-col gap-2 items-center">
                            <h3 className="text-[#0f172a] text-xl font-bold">{title}</h3>
                            {highlight && (
                                <p className="text-point font-semibold text-sm">{highlight}</p>
                            )}
                            <p className="text-[#475569] text-center break-keep text-sm">{description}</p>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="w-full flex flex-col gap-2">
                            <button
                                type="button"
                                className="w-full p-2 rounded-lg bg-red-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {confirmLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full p-2 rounded-lg bg-gray-1 text-gray-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                취소하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
