import { cn } from '@/libs/cn';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
    return <div className={cn('mx-auto w-full max-w-screen-lg h-[100dvh]', className)}>{children}</div>;
}
