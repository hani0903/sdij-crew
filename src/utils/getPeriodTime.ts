/**
 * 교시 번호(number)를 받아 수업 시간대 문자열을 반환합니다.
 * @param period 교시 번호 (1~6)
 * @returns "시작시간 ~ 종료시간" 형태의 문자열
 */
export const getPeriodTime = (period: number): string => {
    switch (period) {
        case 1:
            return '08:30 ~ 10:10';
        case 2:
            return '10:30 ~ 12:10';
        case 3:
            return '13:20 ~ 15:00';
        case 4:
            return '15:20 ~ 17:00';
        case 5:
            return '18:20 ~ 20:00';
        case 6:
            return '20:20 ~ 22:00';
        default:
            return '시간 정보 없음';
    }
};
