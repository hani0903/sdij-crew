/**
 * 제네릭 검색 + 드롭다운 선택 컴포넌트
 *
 * - 데이터(items, isLoading, isError)는 props로 수신 → 훅/서비스 레이어와 완전 분리
 * - 키보드 네비게이션(ArrowDown/ArrowUp/Enter/Escape) 지원
 * - aria-activedescendant, aria-live 영역으로 스크린리더 접근성 확보
 */

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { useClickOutside } from '@/hooks/common/use-click-outside';
import { cn } from '@/libs/cn';

// ─── Props ───────────────────────────────────────────────────────────────────

interface ComboboxProps<T> {
    /** 드롭다운에 표시할 아이템 배열 (undefined = 아직 로드 안 됨) */
    items: T[] | undefined;
    /** 데이터 로딩 중 여부 */
    isLoading: boolean;
    /** 에러 발생 여부 */
    isError: boolean;
    /** 아이템 고유 키 추출 함수 */
    getItemKey: (item: T) => string | number;
    /** 드롭다운 및 선택 후 인풋에 표시할 라벨 추출 함수 */
    getItemLabel: (item: T) => string;
    /** 아이템 선택 시 호출되는 콜백 */
    onSelect: (item: T) => void;
    /** 검색어 변경 시 호출되는 콜백 */
    onQueryChange: (query: string) => void;
    /** 외부에서 인풋 값을 주입할 때 사용 (AI 추출 결과 자동완성 등) */
    value?: string;
    placeholder?: string;
    className?: string;
    /** 인풋의 aria-label */
    'aria-label'?: string;
}

// ─── 컴포넌트 ────────────────────────────────────────────────────────────────

// 제네릭 컴포넌트는 forwardRef와 함께 쓰면 타입 추론이 제한되므로
// ref가 필요 없는 이 컴포넌트는 일반 함수로 선언한다.
export function Combobox<T>({
    items,
    isLoading,
    isError,
    getItemKey,
    getItemLabel,
    onSelect,
    onQueryChange,
    value,
    placeholder,
    className,
    'aria-label': ariaLabel,
}: ComboboxProps<T>) {
    const [inputValue, setInputValue] = useState(value ?? '');
    const [isOpen, setIsOpen] = useState(false);
    // 키보드로 현재 포커스된 아이템 인덱스 (-1 = 없음)
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();
    const getOptionId = (index: number) => `${listboxId}-option-${index}`;

    // 외부 value 변경 시 내부 state 동기화 (AI 추출 결과 주입 등)
    useEffect(() => {
        if (value !== undefined) setInputValue(value);
    }, [value]);

    // 컨테이너 외부 클릭 시 드롭다운 닫기
    useClickOutside(containerRef, useCallback(() => setIsOpen(false), []));

    // 드롭다운 표시 조건: 포커스 상태이며 입력값이 있을 때
    const showDropdown = isOpen && inputValue.trim().length > 0;

    // 에러 상태에서는 이전 결과를 표시하지 않음
    const visibleItems = !isError && items ? items : [];

    // ── 핸들러 ──────────────────────────────────────────────────────────────

    const handleQueryChange = useCallback(
        (query: string) => {
            setInputValue(query);
            setIsOpen(true);
            setActiveIndex(-1);
            onQueryChange(query);
        },
        [onQueryChange],
    );

    const handleSelect = useCallback(
        (item: T) => {
            setInputValue(getItemLabel(item));
            setIsOpen(false);
            setActiveIndex(-1);
            onSelect(item);
        },
        [getItemLabel, onSelect],
    );

    /** 키보드 네비게이션 처리 */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (!showDropdown) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex((prev) => Math.min(prev + 1, visibleItems.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex((prev) => Math.max(prev - 1, -1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && visibleItems[activeIndex]) {
                        handleSelect(visibleItems[activeIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setActiveIndex(-1);
                    break;
            }
        },
        [showDropdown, activeIndex, visibleItems, handleSelect],
    );

    // ── 렌더 ────────────────────────────────────────────────────────────────

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            <SearchInput
                value={inputValue}
                onQueryChange={handleQueryChange}
                onFocus={() => inputValue.trim().length > 0 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={ariaLabel}
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                aria-controls={listboxId}
                aria-activedescendant={activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
                // 로딩 스피너는 Combobox 레이어에서 우측에 오버레이로 표시
                className={isLoading ? 'pr-10' : undefined}
            />

            {/* 로딩 스피너 — SearchInput의 기본 아이콘 위에 오버레이 */}
            {isLoading && (
                <span
                    aria-label="검색 중"
                    className="absolute right-3 top-1/2 -translate-y-1/2 block w-4 h-4 rounded-full border-2 border-gray-200 border-t-point animate-spin pointer-events-none"
                />
            )}

            {/* 검색 결과 드롭다운 */}
            {showDropdown && (
                <div
                    id={listboxId}
                    role="listbox"
                    className={cn(
                        'absolute top-full left-0 z-10 w-full mt-1',
                        'bg-white rounded-lg md:rounded-xl shadow-md',
                        'border border-gray-100',
                        'max-h-48 overflow-y-auto',
                    )}
                >
                    {/* 스크린리더용 상태 안내 (시각적으로 숨김) */}
                    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                        {isLoading && '검색 중입니다.'}
                        {isError && '검색 중 오류가 발생했습니다.'}
                        {!isLoading && !isError && visibleItems.length === 0 && '검색 결과가 없습니다.'}
                        {!isLoading && !isError && visibleItems.length > 0 &&
                            `${visibleItems.length}개의 검색 결과가 있습니다.`}
                    </div>

                    {/* 에러 상태 */}
                    {isError && (
                        <p className="px-3 py-2 md:px-4 md:py-3 text-[13px] md:text-base text-red-400">
                            검색 중 오류가 발생했습니다.
                        </p>
                    )}

                    {/* 결과 없음 — 로딩 완료 후 배열이 비어있을 때 */}
                    {!isLoading && !isError && items !== undefined && visibleItems.length === 0 && (
                        <p className="px-3 py-2 md:px-4 md:py-3 text-[13px] md:text-base text-gray-400">
                            검색 결과가 없습니다.
                        </p>
                    )}

                    {/* 검색 결과 목록 */}
                    {visibleItems.map((item, index) => (
                        <button
                            key={getItemKey(item)}
                            id={getOptionId(index)}
                            type="button"
                            role="option"
                            aria-selected={activeIndex === index}
                            onClick={() => handleSelect(item)}
                            className={cn(
                                'relative flex w-full items-center',
                                'px-3 py-2 md:px-4 md:py-3',
                                'text-[13px] md:text-base text-gray-800 leading-normal',
                                'first:rounded-t-lg last:rounded-b-lg',
                                'md:first:rounded-t-xl md:last:rounded-b-xl',
                                'transition-colors',
                                activeIndex === index
                                    ? 'bg-point text-white'
                                    : 'bg-point/10 hover:text-white hover:bg-point active:bg-point active:text-white',
                            )}
                        >
                            {getItemLabel(item)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export type { ComboboxProps };
