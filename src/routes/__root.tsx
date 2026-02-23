import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { queryClient } from '../providers/query-client';
import BottomNavigation from '../components/ui/BottomNavigation';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-screen h-dvh mobile:h-screen bg-gray-200 flex justify-center">
                <div className="w-full bg-white h-full flex flex-col">
                    {/* <Header title="시대인재" /> */}
                    <div className="w-full h-full flex-col flex">
                        <Outlet />
                    </div>
                    <BottomNavigation />
                </div>
            </div>
        </QueryClientProvider>
    );
}
