import { cn } from '@/libs/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                primary: 'bg-point text-white hover:bg-point/80',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                outline: 'border border-gray-300 bg-white hover:bg-gray-50',
                ghost: 'hover:bg-gray-100 text-gray-700',
                danger: 'bg-red-600 text-white hover:bg-red-700',
            },
            size: {
                sm: 'h-8  px-3 text-xs',
                md: 'h-10 px-4 text-sm',
                lg: 'h-12 px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            >
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {children}
            </button>
        );
    },
);
Button.displayName = 'Button';
