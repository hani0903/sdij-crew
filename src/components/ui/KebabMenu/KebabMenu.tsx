import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/libs/cn';

export interface KebabMenuItem {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

export interface KebabMenuProps {
    items: KebabMenuItem[];
    className?: string;
}

interface DropdownPosition {
    top: number;
    left: number;
}

export function KebabMenu({ items, className }: KebabMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // 드롭다운 열기 — 버튼의 viewport 기준 좌표를 계산해 fixed 포지셔닝에 사용
    const handleOpen = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        setPosition({
            top: rect.bottom + 4, // 버튼 아래 4px 간격
            left: rect.right,     // 버튼 우측 끝 기준 (오른쪽 정렬은 transform으로 처리)
        });
        setIsOpen(true);
    };

    // 외부 클릭 시 닫기 — 버튼과 드롭다운 모두 제외
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedButton = buttonRef.current?.contains(target);
            const clickedDropdown = dropdownRef.current?.contains(target);
            if (!clickedButton && !clickedDropdown) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    const handleItemClick = (item: KebabMenuItem) => {
        item.onClick();
        setIsOpen(false);
    };

    return (
        <div className={cn(className)}>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                className="p-1 rounded-md text-[#9CA3AF] hover:text-[#6B7280] hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="메뉴 열기"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <MoreVertical className="size-4" />
            </button>

            {/* Portal: body에 직접 렌더링해 overflow:hidden 부모의 클리핑을 우회 */}
            {isOpen &&
                createPortal(
                    <ul
                        ref={dropdownRef}
                        role="menu"
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            transform: 'translateX(-100%)', // 버튼 우측 끝 기준으로 왼쪽 정렬
                        }}
                        className="z-[9999] min-w-[120px] bg-white rounded-lg shadow-lg border border-[#F3F4F6] py-1 overflow-hidden"
                    >
                        {items.map((item) => (
                            <li key={item.label} role="none">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleItemClick(item)}
                                    className={cn(
                                        'w-full px-4 py-2 text-sm text-left whitespace-nowrap hover:bg-gray-50 transition-colors cursor-pointer',
                                        item.variant === 'danger' ? 'text-red-500' : 'text-[#374151]'
                                    )}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>,
                    document.body
                )}
        </div>
    );
}
