import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/random')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div className="w-full h-full flex items-center justify-center text-gray-2">곧 추가될 페이지입니다 ...</div>;
}
