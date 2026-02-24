import type { ClassSession } from '@/types/schedule/classSession.type';
import type { ClassEntry, ClassStatus } from '@/components/schedule/Timetable';

const STATUS_MAP: Record<ClassSession['status'], ClassStatus> = {
    NORMAL: 'normal',
    CANCELLED: 'cancelled',
    MAKEUP: 'makeup',
};

export function toClassEntry(session: ClassSession): ClassEntry {
    return {
        period: `${session.periodNumber}교시`,
        room: `${session.roomNumber}호`,
        teacher: session.teacherName,
        subject: session.subject,
        group: session.group,
        inPersonCount: session.inPersonCount,
        onlineCount: session.onlineCount,
        status: STATUS_MAP[session.status],
    };
}