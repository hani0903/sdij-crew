import type { ClassSession, ClassSessionStatus } from '@/types/schedule/classSession.type';
import type { ClassEntry, ClassStatus } from '@/components/schedule/Timetable';

// ClassSession의 classStatus(서버 형식)를 UI의 ClassStatus로 변환하는 매핑
const STATUS_MAP: Record<ClassSessionStatus, ClassStatus> = {
    NORMAL: 'normal',
    CANCELLED: 'cancelled',
    MAKEUP: 'makeup',
};

export function toClassEntry(session: ClassSession): ClassEntry {
    return {
        period: `${session.periodNumber}교시`,
        // classroomId는 숫자(예: 602)이므로 "602호" 형태로 변환
        room: `${session.classroomId}호`,
        // teacherId는 서버에서 받은 ID이므로 임시로 문자열 변환
        // 실제 구현에서는 teacher 목록에서 이름을 조회해야 함
        teacher: String(session.teacherId),
        subject: session.subject,
        group: session.group,
        inPersonCount: session.inPersonCount,
        onlineCount: session.onlineCount,
        status: STATUS_MAP[session.classStatus],
    };
}