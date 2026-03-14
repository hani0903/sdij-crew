import { cn } from '../../libs/cn';

interface TabOption<T extends string> {
    label: string;
    value: T;
}

interface SegmentedControlProps<T extends string> {
    // readonly 배열도 허용 — as const 로 선언된 TAB_OPTIONS를 직접 전달할 수 있도록
    options: ReadonlyArray<TabOption<T>>;
    selectedValue: T;
    onChange: (value: T) => void;
    className?: string;
}

export const SegmentedControl = <T extends string>({
    options,
    selectedValue,
    onChange,
    className,
}: SegmentedControlProps<T>) => {
    return (
        <ul
            className={cn(
                'w-full mobile:max-w-[200px] p-1.5 rounded-xl bg-gray-1 flex items-center list-none text-sm font-medium text-gray-3',
                className,
            )}
        >
            {options.map((option) => (
                <li key={option.value} className="flex-1">
                    <button
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'cursor-pointer p-2 font-bold w-full text-center transition-all duration-200',
                            selectedValue === option.value
                                ? 'text-point rounded-xl bg-white shadow-sm' // 활성화 스타일
                                : 'text-[#64748B]', // 비활성화 스타일
                        )}
                    >
                        {option.label}
                    </button>
                </li>
            ))}
        </ul>
    );
};
