// Input.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

const inputVariants = cva(
    [
        'bg-[#F6F6F8] w-full p-2 md:p-4 rounded-lg md:rounded-xl',
        'placeholder:text-[#94A3B8] text-sm outline-none',
        'border-2 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' '),
    {
        variants: {
            variant: {
                default: 'border-transparent focus:border-point/50',
                error: 'border-red-400 focus:border-red-400',
            },
            // size는 나중에 필요하면 여기에 추가
            // size: { sm: '...', md: '...', lg: '...' },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, leftAdornment, rightAdornment, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                {leftAdornment && (
                    <span className="absolute left-3 flex items-center text-[#94A3B8]">{leftAdornment}</span>
                )}

                <input
                    ref={ref}
                    className={cn(
                        inputVariants({ variant }),
                        leftAdornment && 'pl-9',
                        rightAdornment && 'pr-9',
                        className,
                    )}
                    {...props}
                />

                {rightAdornment && (
                    <span className="absolute right-3 flex items-center text-[#94A3B8]">{rightAdornment}</span>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
