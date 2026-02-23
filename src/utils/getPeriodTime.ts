/**
 * 교시 정보를 기반으로 수업 시간대(string)를 반환합니다.
 * @param period 교시 (예: "1교시", "1")
 * @returns "시작시간 ~ 종료시간" 형태의 문자열
 */
export const getPeriodTime = (period: string | number): string => {
    // 숫자만 들어올 경우를 대비해 문자열로 변환 후 "교시" 텍스트 제거
    const periodNumber = period.toString().replace('교시', '').trim();

    switch (periodNumber) {
        case '1':
            return '08:30 ~ 10:10';
        case '2':
            return '10:30 ~ 12:10';
        case '3':
            return '13:20 ~ 15:00';
        case '4':
            return '15:20 ~ 17:00';
        case '5':
            return '18:20 ~ 20:00';
        case '6':
            return '20:20 ~ 22:00';
        default:
            return '시간 정보 없음';
    }
};

// 사용 예시
console.log(getPeriodTime('1교시')); // "08:30 ~ 10:10"
console.log(getPeriodTime(2)); // "10:30 ~ 12:10"
