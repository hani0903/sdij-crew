export type ClassSessionStatus = 'NORMAL' | 'CANCELLED' | 'MAKEUP';

export interface ClassSession {
    id: number;
    teacherId: number;
    teacherName: string;
    /** 1~6 */
    periodNumber: number;
    /** 예: 602 */
    roomNumber: number;
    subject: string;
    group: string | null;
    inPersonCount: number;
    onlineCount: number;
    status: ClassSessionStatus;
    /** 'YYYY-MM-DD' */
    date: string;
}