import { createFileRoute } from '@tanstack/react-router';
import TimeTablePage from '../pages/TimeTablePage';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <TimeTablePage />;
}
