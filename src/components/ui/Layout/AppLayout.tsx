import BottomNavigation from '../BottomNavigation';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            {/* overflow-hidden: 자식의 스크롤이 html/body로 전파되지 않도록 차단 */}
            <main className="flex-1 pb-[var(--bottom-nav-height)] md:pb-0 flex flex-col min-h-0 overflow-hidden">{children}</main>
            <BottomNavigation />
        </div>
    );
}
