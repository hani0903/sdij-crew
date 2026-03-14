import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

/** 범용 인풋 컴포넌트 — 네이티브 input 속성을 모두 지원 (type, value, onChange 등) */
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                'bg-[#F6F6F8] w-full p-2 md:p-4 rounded-lg md:rounded-xl',
                'placeholder:text-[#94A3B8] text-sm outline-none',
                'border-2 border-transparent focus:border-point/50 transition-colors',
                className,
            )}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
