import type { Meta, StoryObj } from '@storybook/react-vite';
import Timetable, { type ClassEntry } from '../components/schedule/Timetable';

const meta = {
    title: 'UI/Timetable',
    component: Timetable,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
        classrooms: { description: '열 헤더: 교실 이름 목록', control: 'object' },
        periods: { description: '행 헤더: 교시 이름 목록', control: 'object' },
        data: { description: '수업 데이터 목록 (평면 배열)', control: 'object' },
    },
} satisfies Meta<typeof Timetable>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ────────────────────────────────────────────────────────────
   공통 상수
──────────────────────────────────────────────────────────── */
const CLASSROOMS = ['601호', '602호', '603호', '604호', '605호', '606호', '607호', '608호'];
const PERIODS = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시'];

/*
  [데이터 구조 설명]

  이전: 2D 배열 → data[교시인덱스][교실인덱스]
    → 빈 칸을 null 로 채워야 해서 데이터가 길어짐
    → 인덱스 실수가 쉬움

  현재: 평면 배열 → ClassEntry[]
    → 수업이 있는 것만 나열하면 됨. 빈 칸은 컴포넌트가 알아서 처리.
    → API 응답 형태와 동일해서 변환 작업 불필요.
    → period + room 으로 어느 셀인지 결정됨.
*/
const SAMPLE_DATA: ClassEntry[] = [
    // 1교시
    {
        period: '1교시',
        room: '601호',
        teacher: '김철수',
        subject: '수학',
        group: 'A반',
        inPersonCount: 18,
        onlineCount: 42,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '603호',
        teacher: '이민준',
        subject: '국어',
        inPersonCount: 20,
        onlineCount: 28,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '604호',
        teacher: '최수진',
        subject: '수학',
        group: 'B반',
        inPersonCount: 15,
        onlineCount: 38,
        status: 'cancelled',
    },
    {
        period: '1교시',
        room: '606호',
        teacher: '정다은',
        subject: '과학',
        group: '심화반',
        inPersonCount: 10,
        onlineCount: 22,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '607호',
        teacher: '박지영',
        subject: '영어',
        group: '심화반',
        inPersonCount: 8,
        onlineCount: 19,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '608호',
        teacher: '한지수',
        subject: '국어',
        group: '기본반',
        inPersonCount: 22,
        onlineCount: 31,
        status: 'makeup',
    },
    // 2교시
    {
        period: '2교시',
        room: '601호',
        teacher: '박지영',
        subject: '영어',
        group: '기본반',
        inPersonCount: 14,
        onlineCount: 40,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '602호',
        teacher: '김철수',
        subject: '수학',
        group: 'A반',
        inPersonCount: 17,
        onlineCount: 44,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '604호',
        teacher: '오세훈',
        subject: '사회',
        inPersonCount: 9,
        onlineCount: 17,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '605호',
        teacher: '최수진',
        subject: '수학',
        group: 'B반',
        inPersonCount: 16,
        onlineCount: 36,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '606호',
        teacher: '이민준',
        subject: '국어',
        inPersonCount: 21,
        onlineCount: 30,
        status: 'cancelled',
    },
    {
        period: '2교시',
        room: '608호',
        teacher: '정다은',
        subject: '과학',
        group: '기본반',
        inPersonCount: 11,
        onlineCount: 25,
        status: 'normal',
    },
    // 3교시
    {
        period: '3교시',
        room: '601호',
        teacher: '이민준',
        subject: '국어',
        inPersonCount: 19,
        onlineCount: 27,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '603호',
        teacher: '최수진',
        subject: '수학',
        group: 'A반',
        inPersonCount: 13,
        onlineCount: 39,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '604호',
        teacher: '박지영',
        subject: '영어',
        group: '심화반',
        inPersonCount: 7,
        onlineCount: 21,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '605호',
        teacher: '오세훈',
        subject: '사회',
        inPersonCount: 10,
        onlineCount: 18,
        status: 'makeup',
    },
    {
        period: '3교시',
        room: '607호',
        teacher: '김철수',
        subject: '수학',
        group: 'B반',
        inPersonCount: 16,
        onlineCount: 41,
        status: 'normal',
    },
    // 4교시
    {
        period: '4교시',
        room: '602호',
        teacher: '정다은',
        subject: '과학',
        group: '심화반',
        inPersonCount: 9,
        onlineCount: 20,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '603호',
        teacher: '박지영',
        subject: '영어',
        group: '기본반',
        inPersonCount: 15,
        onlineCount: 37,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '605호',
        teacher: '이민준',
        subject: '국어',
        inPersonCount: 18,
        onlineCount: 29,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '606호',
        teacher: '김철수',
        subject: '수학',
        group: 'A반',
        inPersonCount: 20,
        onlineCount: 45,
        status: 'normal',
    },
    // 5교시
    {
        period: '5교시',
        room: '601호',
        teacher: '오세훈',
        subject: '사회',
        inPersonCount: 9,
        onlineCount: 16,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '602호',
        teacher: '한지수',
        subject: '국어',
        group: '심화반',
        inPersonCount: 14,
        onlineCount: 32,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '604호',
        teacher: '김철수',
        subject: '수학',
        group: 'B반',
        inPersonCount: 17,
        onlineCount: 43,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '606호',
        teacher: '박지영',
        subject: '영어',
        group: '심화반',
        inPersonCount: 6,
        onlineCount: 18,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '608호',
        teacher: '최수진',
        subject: '수학',
        group: 'A반',
        inPersonCount: 15,
        onlineCount: 38,
        status: 'normal',
    },
    // 6교시
    {
        period: '6교시',
        room: '601호',
        teacher: '정다은',
        subject: '과학',
        group: '심화반',
        inPersonCount: 8,
        onlineCount: 21,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '603호',
        teacher: '오세훈',
        subject: '사회',
        inPersonCount: 10,
        onlineCount: 19,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '605호',
        teacher: '박지영',
        subject: '영어',
        group: '기본반',
        inPersonCount: 13,
        onlineCount: 36,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '607호',
        teacher: '정다은',
        subject: '과학',
        group: '기본반',
        inPersonCount: 12,
        onlineCount: 23,
        status: 'makeup',
    },
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
        classrooms: ['601호', '602호', '603호'],
        periods: ['1교시', '2교시', '3교시'],
        data: [
            {
                period: '1교시',
                room: '601호',
                teacher: '김철수',
                subject: '수학',
                group: 'A반',
                inPersonCount: 18,
                onlineCount: 42,
                status: 'normal',
            },
            {
                period: '1교시',
                room: '602호',
                teacher: '박지영',
                subject: '영어',
                inPersonCount: 12,
                onlineCount: 35,
                status: 'cancelled',
            },
            {
                period: '1교시',
                room: '603호',
                teacher: '이민준',
                subject: '국어',
                inPersonCount: 20,
                onlineCount: 28,
                status: 'makeup',
            },
            {
                period: '2교시',
                room: '601호',
                teacher: '오세훈',
                subject: '사회',
                inPersonCount: 9,
                onlineCount: 17,
                status: 'cancelled',
            },
            {
                period: '2교시',
                room: '602호',
                teacher: '최수진',
                subject: '수학',
                group: 'B반',
                inPersonCount: 15,
                onlineCount: 38,
                status: 'normal',
            },
            {
                period: '3교시',
                room: '602호',
                teacher: '김철수',
                subject: '수학',
                group: 'B반',
                inPersonCount: 17,
                onlineCount: 43,
                status: 'normal',
            },
            {
                period: '3교시',
                room: '603호',
                teacher: '박지영',
                subject: '영어',
                group: '심화반',
                inPersonCount: 6,
                onlineCount: 18,
                status: 'cancelled',
            },
        ],
    },
};
