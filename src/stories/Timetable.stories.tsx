import type { Meta, StoryObj } from '@storybook/react-vite';
import Timetable from '../components/schedule/Timetable';
import type { ClassSession } from '../types/schedule/classSession.type';

const meta = {
    title: 'UI/Timetable',
    component: Timetable,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
        classrooms: { description: '열 헤더: 교실 번호 목록 (number[])', control: 'object' },
        periods: { description: '행 헤더: 교시 번호 목록 (number[])', control: 'object' },
        data: { description: '수업 데이터 목록 (ClassSession[])', control: 'object' },
    },
} satisfies Meta<typeof Timetable>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ────────────────────────────────────────────────────────────
   공통 상수 — 숫자 기반 (ClassSession 타입과 일치)
──────────────────────────────────────────────────────────── */
const CLASSROOMS = [601, 602, 603, 604, 605, 606, 607, 608];
const PERIODS = [1, 2, 3, 4, 5, 6];

/*
  [데이터 구조 설명]
  ClassSession 타입을 직접 사용합니다.
  periodNumber + roomNumber 조합으로 어느 셀인지 결정됩니다.
  수업이 있는 것만 나열하면 되며, 빈 칸은 컴포넌트가 자동 처리합니다.
*/
let idCounter = 1;
const makeSession = (overrides: Partial<ClassSession> & Pick<ClassSession, 'periodNumber' | 'roomNumber' | 'teacherName' | 'subject'>): ClassSession => ({
    id: idCounter++,
    teacherId: idCounter,
    group: '',
    inPersonCount: 15,
    onlineCount: 30,
    status: 'NORMAL',
    date: '2026-03-11',
    ...overrides,
});

const SAMPLE_DATA: ClassSession[] = [
    // 1교시
    makeSession({ periodNumber: 1, roomNumber: 601, teacherName: '김철수', subject: '수학', group: 'A반', inPersonCount: 18, onlineCount: 42 }),
    makeSession({ periodNumber: 1, roomNumber: 603, teacherName: '이민준', subject: '국어', inPersonCount: 20, onlineCount: 28 }),
    makeSession({ periodNumber: 1, roomNumber: 604, teacherName: '최수진', subject: '수학', group: 'B반', inPersonCount: 15, onlineCount: 38, status: 'CANCELLED' }),
    makeSession({ periodNumber: 1, roomNumber: 606, teacherName: '정다은', subject: '과학', group: '심화반', inPersonCount: 10, onlineCount: 22 }),
    makeSession({ periodNumber: 1, roomNumber: 607, teacherName: '박지영', subject: '영어', group: '심화반', inPersonCount: 8, onlineCount: 19 }),
    makeSession({ periodNumber: 1, roomNumber: 608, teacherName: '한지수', subject: '국어', group: '기본반', inPersonCount: 22, onlineCount: 31, status: 'MAKEUP' }),
    // 2교시
    makeSession({ periodNumber: 2, roomNumber: 601, teacherName: '박지영', subject: '영어', group: '기본반', inPersonCount: 14, onlineCount: 40 }),
    makeSession({ periodNumber: 2, roomNumber: 602, teacherName: '김철수', subject: '수학', group: 'A반', inPersonCount: 17, onlineCount: 44 }),
    makeSession({ periodNumber: 2, roomNumber: 604, teacherName: '오세훈', subject: '사회', inPersonCount: 9, onlineCount: 17 }),
    makeSession({ periodNumber: 2, roomNumber: 605, teacherName: '최수진', subject: '수학', group: 'B반', inPersonCount: 16, onlineCount: 36 }),
    makeSession({ periodNumber: 2, roomNumber: 606, teacherName: '이민준', subject: '국어', inPersonCount: 21, onlineCount: 30, status: 'CANCELLED' }),
    makeSession({ periodNumber: 2, roomNumber: 608, teacherName: '정다은', subject: '과학', group: '기본반', inPersonCount: 11, onlineCount: 25 }),
    // 3교시
    makeSession({ periodNumber: 3, roomNumber: 601, teacherName: '이민준', subject: '국어', inPersonCount: 19, onlineCount: 27 }),
    makeSession({ periodNumber: 3, roomNumber: 603, teacherName: '최수진', subject: '수학', group: 'A반', inPersonCount: 13, onlineCount: 39 }),
    makeSession({ periodNumber: 3, roomNumber: 604, teacherName: '박지영', subject: '영어', group: '심화반', inPersonCount: 7, onlineCount: 21 }),
    makeSession({ periodNumber: 3, roomNumber: 605, teacherName: '오세훈', subject: '사회', inPersonCount: 10, onlineCount: 18, status: 'MAKEUP' }),
    makeSession({ periodNumber: 3, roomNumber: 607, teacherName: '김철수', subject: '수학', group: 'B반', inPersonCount: 16, onlineCount: 41 }),
    // 4교시
    makeSession({ periodNumber: 4, roomNumber: 602, teacherName: '정다은', subject: '과학', group: '심화반', inPersonCount: 9, onlineCount: 20 }),
    makeSession({ periodNumber: 4, roomNumber: 603, teacherName: '박지영', subject: '영어', group: '기본반', inPersonCount: 15, onlineCount: 37 }),
    makeSession({ periodNumber: 4, roomNumber: 605, teacherName: '이민준', subject: '국어', inPersonCount: 18, onlineCount: 29 }),
    makeSession({ periodNumber: 4, roomNumber: 606, teacherName: '김철수', subject: '수학', group: 'A반', inPersonCount: 20, onlineCount: 45 }),
    // 5교시
    makeSession({ periodNumber: 5, roomNumber: 601, teacherName: '오세훈', subject: '사회', inPersonCount: 9, onlineCount: 16 }),
    makeSession({ periodNumber: 5, roomNumber: 602, teacherName: '한지수', subject: '국어', group: '심화반', inPersonCount: 14, onlineCount: 32 }),
    makeSession({ periodNumber: 5, roomNumber: 604, teacherName: '김철수', subject: '수학', group: 'B반', inPersonCount: 17, onlineCount: 43 }),
    makeSession({ periodNumber: 5, roomNumber: 606, teacherName: '박지영', subject: '영어', group: '심화반', inPersonCount: 6, onlineCount: 18 }),
    makeSession({ periodNumber: 5, roomNumber: 608, teacherName: '최수진', subject: '수학', group: 'A반', inPersonCount: 15, onlineCount: 38 }),
    // 6교시
    makeSession({ periodNumber: 6, roomNumber: 601, teacherName: '정다은', subject: '과학', group: '심화반', inPersonCount: 8, onlineCount: 21 }),
    makeSession({ periodNumber: 6, roomNumber: 603, teacherName: '오세훈', subject: '사회', inPersonCount: 10, onlineCount: 19 }),
    makeSession({ periodNumber: 6, roomNumber: 605, teacherName: '박지영', subject: '영어', group: '기본반', inPersonCount: 13, onlineCount: 36 }),
    makeSession({ periodNumber: 6, roomNumber: 607, teacherName: '정다은', subject: '과학', group: '기본반', inPersonCount: 12, onlineCount: 23, status: 'MAKEUP' }),
];

/* ────────────────────────────────────────────────────────────
   스토리들
──────────────────────────────────────────────────────────── */

export const Default: Story = {
    name: '기본 시간표',
    args: { classrooms: CLASSROOMS, periods: PERIODS, data: SAMPLE_DATA },
};

/** 빈 배열을 넘기면 모든 셀이 — 로 표시됨 */
export const Empty: Story = {
    name: '전체 빈 시간표',
    args: { classrooms: CLASSROOMS, periods: PERIODS, data: [] },
};

/** 휴강/보강 상태 집중 확인 */
export const StatusFocus: Story = {
    name: '상태 집중 확인 (휴강 · 보강)',
    args: {
        classrooms: [601, 602, 603],
        periods: [1, 2, 3],
        data: [
            makeSession({ periodNumber: 1, roomNumber: 601, teacherName: '김철수', subject: '수학', group: 'A반', inPersonCount: 18, onlineCount: 42 }),
            makeSession({ periodNumber: 1, roomNumber: 602, teacherName: '박지영', subject: '영어', inPersonCount: 12, onlineCount: 35, status: 'CANCELLED' }),
            makeSession({ periodNumber: 1, roomNumber: 603, teacherName: '이민준', subject: '국어', inPersonCount: 20, onlineCount: 28, status: 'MAKEUP' }),
            makeSession({ periodNumber: 2, roomNumber: 601, teacherName: '오세훈', subject: '사회', inPersonCount: 9, onlineCount: 17, status: 'CANCELLED' }),
            makeSession({ periodNumber: 2, roomNumber: 602, teacherName: '최수진', subject: '수학', group: 'B반', inPersonCount: 15, onlineCount: 38 }),
            makeSession({ periodNumber: 3, roomNumber: 602, teacherName: '김철수', subject: '수학', group: 'B반', inPersonCount: 17, onlineCount: 43 }),
            makeSession({ periodNumber: 3, roomNumber: 603, teacherName: '박지영', subject: '영어', group: '심화반', inPersonCount: 6, onlineCount: 18, status: 'CANCELLED' }),
        ],
    },
};
