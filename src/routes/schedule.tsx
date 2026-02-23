import { createFileRoute } from '@tanstack/react-router';
import TimeTablePage from '../pages/TimeTablePage';

export const Route = createFileRoute('/schedule')({
    component: RouteComponent,
});

function RouteComponent() {
    return <TimeTablePage />;
}
