import { PlusIcon } from '@/assets';
import { cn } from '@/libs/cn';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    className?: string; // 외부에서 위치를 조정할 수 있게 허용
}

export const FloatingActionButton = ({ icon = <PlusIcon />, className, ...props }: Props) => {
    return (
        <button
            type="button"
            className={cn(
                'absolute right-4 bottom-4 size-14 rounded-full bg-point cursor-pointer',
                'flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:border-2 active:border-white',
                className,
            )}
            {...props}
        >
            {icon}
        </button>
    );
};
