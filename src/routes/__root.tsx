import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { queryClient } from '../providers/query-client';
import BottomNavigation from '../components/ui/BottomNavigation';
import Header from '../components/ui/Header';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-screen h-dvh bg-gray-200 flex justify-center">
                <div className="w-full bg-white h-full flex flex-col">
                    <Header title="시대인재" />
                    <div className="w-full flex-col flex flex-1 min-h-0 overflow-y-auto">
                        <Outlet />
                    </div>
                    <BottomNavigation />
                </div>
            </div>
        </QueryClientProvider>
    );
}
