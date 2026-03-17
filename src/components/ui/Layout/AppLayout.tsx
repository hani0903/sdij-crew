import BottomNavigation from '../BottomNavigation';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="h-full w-full flex flex-col">
            <main className="flex-1 pb-[var(--bottom-nav-height)] md:pb-0 flex flex-col">{children}</main>
            <BottomNavigation />
        </div>
    );
}
