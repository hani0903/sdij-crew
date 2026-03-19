import { forwardRef, useCallback, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import Input from '@/components/ui/Input/Input';
import { cn } from '@/libs/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    /** 검색어 변경 시 호출되는 콜백 */
    onQueryChange: (query: string) => void;
    /** 인풋에 표시할 현재 값 — 부모가 단일 진실 공급원 */
    value?: string;
    className?: string;
}

function SearchInputInner(
    { onQueryChange, value = '', placeholder, className, ...inputProps }: SearchInputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    // SearchInput은 순수 controlled component: 내부 state 없음
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onQueryChange(e.target.value);
        },
        [onQueryChange],
    );

    const handleClear = useCallback(() => {
        onQueryChange('');
    }, [onQueryChange]);

    return (
        <div className={cn('relative w-full', className)}>
            <Input
                ref={ref}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                // 우측 아이콘 영역과 겹치지 않도록 오른쪽 패딩 확보
                className="pr-16"
                {...inputProps}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {value.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="검색어 지우기"
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                    >
                        <X className="w-2.5 h-2.5 text-white" aria-hidden="true" strokeWidth={3} />
                    </button>
                )}
                <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
            </div>
        </div>
    );
}

const SearchInput = forwardRef(SearchInputInner);
SearchInput.displayName = 'SearchInput';

export type { SearchInputProps };
export default SearchInput;
