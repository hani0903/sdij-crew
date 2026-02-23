import Header from './components/ui/Header';
import Timetable, { type ClassEntry } from './components/ui/Timetable';

const TUESDAY_DATA: ClassEntry[] = [
    {
        period: '1교시',
        room: '605호',
        teacher: '김윤환',
        subject: '인문논술',
        group: 'A(선택)반',
        inPersonCount: 25,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'S반',
        inPersonCount: 128,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '1교시',
        room: '608호',
        teacher: '정태혁',
        subject: '지1',
        group: 'B반',
        inPersonCount: 130,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '602호',
        teacher: '장재원',
        subject: '수학(수2)',
        group: 'S반',
        inPersonCount: 72,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '603호',
        teacher: '이동선',
        subject: '수학(수2)',
        group: 'D반',
        inPersonCount: 124,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '605호',
        teacher: '김윤환',
        subject: '인문논술',
        group: 'B(선택)반',
        inPersonCount: 118,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'N반',
        inPersonCount: 100,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '2교시',
        room: '607호',
        teacher: '송준혁',
        subject: '과목 아직 모름',
        group: 'O반',
        inPersonCount: 125,
        onlineCount: 0,
        status: 'cancelled',
    },
    {
        period: '2교시',
        room: '608호',
        teacher: '정태혁',
        subject: '지1',
        group: 'C반',
        inPersonCount: 21,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '603호',
        teacher: '이동선',
        subject: '수학(수2)',
        group: 'O반',
        inPersonCount: 125,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '606호',
        teacher: '현유찬',
        subject: '국어(독서)',
        group: 'D반',
        inPersonCount: 124,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '3교시',
        room: '607호',
        teacher: '송준혁',
        subject: '과목 아직 모름',
        group: 'S반',
        inPersonCount: 72,
        onlineCount: 0,
        status: 'cancelled',
    },
    {
        period: '3교시',
        room: '608호',
        teacher: '김미향',
        subject: '생윤',
        group: 'A(1)반',
        inPersonCount: 47,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '606호',
        teacher: '현정훈',
        subject: '물1',
        group: 'A반',
        inPersonCount: 107,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '4교시',
        room: '608호',
        teacher: '김미향',
        subject: '사문',
        group: 'A(1)반',
        inPersonCount: 130,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '601호',
        teacher: '현정훈',
        subject: '물2',
        group: '선택반',
        inPersonCount: 35,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '5교시',
        room: '602호',
        teacher: '박근수',
        subject: '정법',
        group: null,
        inPersonCount: 28,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '601호',
        teacher: '현정훈',
        subject: '물2',
        group: '선택반',
        inPersonCount: 35,
        onlineCount: 0,
        status: 'normal',
    },
    {
        period: '6교시',
        room: '602호',
        teacher: '박근수',
        subject: '정법',
        group: null,
        inPersonCount: 28,
        onlineCount: 0,
        status: 'normal',
    },
];

function App() {
    return (
        <div className="w-full h-screen flex flex-col">
            <Header title="시대인재" ctaLabel="로그인" />
            <main className="w-full flex-1 py-4 px-5 flex flex-col gap-4 xl:max-w-[1200px] xl:mx-auto">
                <h2 className="text-20 font-semibold">화요일 시간표</h2>
                <nav>
                    <ul className="flex items-center gap-2 list-none">
                        <li>전체</li>
                        <li>이번 교시</li>
                    </ul>
                </nav>
                <section className="w-full flex flex-col">
                    <Timetable
                        data={TUESDAY_DATA}
                        periods={['1교시', '2교시', '3교시', '4교시', '5교시', '6교시']}
                        classrooms={['601호', '602호', '603호', '604호', '605호', '606호', '607호', '608호']}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
