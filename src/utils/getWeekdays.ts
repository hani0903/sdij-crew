import { WEEKDAYS } from '../constants/week';

const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0(일) ~ 6(토)

    // 이번 주 일요일 구하기
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);

    // 일요일부터 토요일까지 7일간의 데이터 생성
    return Array.from({ length: 7 }, (_, i) => {
        const targetDate = new Date(sunday);
        targetDate.setDate(sunday.getDate() + i);

        return {
            date: targetDate,
            dayNumber: targetDate.getDate(),
            weekday: WEEKDAYS[i],
            isToday: targetDate.toDateString() === today.toDateString(),
        };
    });
};

export default getWeekDays;
