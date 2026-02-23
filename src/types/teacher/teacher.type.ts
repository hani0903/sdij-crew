export interface TeacherSetting {
    name: string;
    chalk: { detail?: string; type: 'academy' | 'mixed' | 'personal' };
    eraser: 'default' | string; // "default" 또는 상세설명
    mic: 'academy' | 'personal';
    ppt: boolean;
    detail?: string;
    email: boolean;
}
