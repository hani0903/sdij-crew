import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { queryClient } from '../providers/query-client';
import Header from '../components/ui/Header';
import BottomNavigation from '../components/ui/BottomNavigation';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-dvw h-dvh bg-gray-200 flex justify-center">
                <div className="w-full bg-white h-full">
                    {/* <Header title="시대인재" /> */}
                    <Outlet />
                    <BottomNavigation />
                </div>
            </div>
        </QueryClientProvider>
    );
}
