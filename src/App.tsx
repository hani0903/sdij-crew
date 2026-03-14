import Header from './components/ui/Header';
import Timetable from './components/schedule/Timetable';
import type { ClassSession } from './types/schedule/classSession.type';

// App.tsx는 개발 확인용 스텁 데이터를 포함합니다.
// ClassSession 타입(periodNumber: number, roomNumber: number)으로 통일되었습니다.
const TUESDAY_DATA: ClassSession[] = [
    {
        id: 1, teacherId: 1,
        periodNumber: 1, roomNumber: 605,
        teacherName: '김윤환', subject: '인문논술', group: 'A(선택)반',
        inPersonCount: 25, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 2, teacherId: 2,
        periodNumber: 1, roomNumber: 606,
        teacherName: '현유찬', subject: '국어(독서)', group: 'S반',
        inPersonCount: 128, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 3, teacherId: 3,
        periodNumber: 1, roomNumber: 608,
        teacherName: '정태혁', subject: '지1', group: 'B반',
        inPersonCount: 130, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 4, teacherId: 4,
        periodNumber: 2, roomNumber: 602,
        teacherName: '장재원', subject: '수학(수2)', group: 'S반',
        inPersonCount: 72, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 5, teacherId: 5,
        periodNumber: 2, roomNumber: 603,
        teacherName: '이동선', subject: '수학(수2)', group: 'D반',
        inPersonCount: 124, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 6, teacherId: 1,
        periodNumber: 2, roomNumber: 605,
        teacherName: '김윤환', subject: '인문논술', group: 'B(선택)반',
        inPersonCount: 118, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 7, teacherId: 2,
        periodNumber: 2, roomNumber: 606,
        teacherName: '현유찬', subject: '국어(독서)', group: 'N반',
        inPersonCount: 100, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 8, teacherId: 6,
        periodNumber: 2, roomNumber: 607,
        teacherName: '송준혁', subject: '과목 아직 모름', group: 'O반',
        inPersonCount: 125, onlineCount: 0, status: 'CANCELLED', date: '2026-03-11',
    },
    {
        id: 9, teacherId: 3,
        periodNumber: 2, roomNumber: 608,
        teacherName: '정태혁', subject: '지1', group: 'C반',
        inPersonCount: 21, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 10, teacherId: 5,
        periodNumber: 3, roomNumber: 603,
        teacherName: '이동선', subject: '수학(수2)', group: 'O반',
        inPersonCount: 125, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 11, teacherId: 2,
        periodNumber: 3, roomNumber: 606,
        teacherName: '현유찬', subject: '국어(독서)', group: 'D반',
        inPersonCount: 124, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 12, teacherId: 6,
        periodNumber: 3, roomNumber: 607,
        teacherName: '송준혁', subject: '과목 아직 모름', group: 'S반',
        inPersonCount: 72, onlineCount: 0, status: 'CANCELLED', date: '2026-03-11',
    },
    {
        id: 13, teacherId: 7,
        periodNumber: 3, roomNumber: 608,
        teacherName: '김미향', subject: '생윤', group: 'A(1)반',
        inPersonCount: 47, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 14, teacherId: 8,
        periodNumber: 4, roomNumber: 606,
        teacherName: '현정훈', subject: '물1', group: 'A반',
        inPersonCount: 107, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 15, teacherId: 7,
        periodNumber: 4, roomNumber: 608,
        teacherName: '김미향', subject: '사문', group: 'A(1)반',
        inPersonCount: 130, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 16, teacherId: 8,
        periodNumber: 5, roomNumber: 601,
        teacherName: '현정훈', subject: '물2', group: '선택반',
        inPersonCount: 35, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 17, teacherId: 9,
        periodNumber: 5, roomNumber: 602,
        teacherName: '박근수', subject: '정법', group: '',
        inPersonCount: 28, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 18, teacherId: 8,
        periodNumber: 6, roomNumber: 601,
        teacherName: '현정훈', subject: '물2', group: '선택반',
        inPersonCount: 35, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
    {
        id: 19, teacherId: 9,
        periodNumber: 6, roomNumber: 602,
        teacherName: '박근수', subject: '정법', group: '',
        inPersonCount: 28, onlineCount: 0, status: 'NORMAL', date: '2026-03-11',
    },
];

function App() {
    return (
        <div className="w-full h-screen flex flex-col">
            <Header
                title="시대인재"
                ctaLabel="로그인"
                onCtaClick={() => {
                    if (import.meta.env.PROD) {
                        window.location.href =
                            'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=https://www.sdij.site/login/oauth2/code/kakao&scope=profile_nickname account_email';
                    } else {
                        window.location.href =
                            'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=http://localhost:5173/login/oauth2/code/kakao&scope=profile_nickname account_email';
                    }
                }}
            />
            <main className="w-full flex-1 py-4 px-5 flex flex-col gap-4 xl:max-w-[1200px] xl:mx-auto">
                <h2 className="text-xl font-semibold">화요일 시간표</h2>
                <nav>
                    <ul className="flex items-center gap-2 list-none">
                        <li>전체</li>
                        <li>이번 교시</li>
                    </ul>
                </nav>
                <section className="w-full flex flex-col">
                    <Timetable
                        data={TUESDAY_DATA}
                        periods={[1, 2, 3, 4, 5, 6]}
                        classrooms={[601, 602, 603, 604, 605, 606, 607, 608]}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
