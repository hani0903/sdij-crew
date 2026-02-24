export interface weekDay {
    date: Date; // 실제 날짜 객체
    dayNumber: number; // 1 ~ 31
    weekday: string; // '월'
    isToday: boolean; // 오늘 여부 (점 표시용)
}
