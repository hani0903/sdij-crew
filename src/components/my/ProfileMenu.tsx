import { useState, useRef, useEffect } from 'react';
import DefaultProfileIcon from '@/assets/icons/default-profile.svg?react';
import { cn } from '@/libs/cn';
import { authService } from '@/services/auth/auth.service';
import { useClearAuth } from '@/stores/auth.store';
type MenuItem = { label: string; onClick: () => void; danger?: boolean; url?: string };

export function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const clearAuth = useClearAuth();

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const menuItems: MenuItem[] = [
        // { label: '마이페이지', onClick: () => {} },
        // { label: '설정', onClick: () => {} },
        {
            label: '로그아웃',
            onClick: async () => {
                await authService.logout();
                clearAuth();
            },
            danger: true,
        },
    ] as const;

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    'outline-none active:border-gray-2 cursor-pointer transition-all border-2 border-transparent hover:border-gray-2 aspect-square size-9 rounded-full overflow-hidden ease-in-out duration-200',
                    isOpen && 'border-gray-2',
                )}
            >
                <DefaultProfileIcon />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl
          border border-gray-100 bg-white shadow-lg overflow-hidden"
                >
                    {menuItems.map(({ label, onClick, danger }, idx) => (
                        <button
                            key={label}
                            onClick={() => {
                                onClick();
                                setIsOpen(false);
                            }}
                            className={`cursor-pointer w-full px-4 py-2 text-left text-sm transition-colors
                ${danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'} ${idx === 0 && 'py-1'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
