/**
 * 현재 시간을 기준으로 진행 중인 교시 번호를 반환합니다.
 * - 첫 수업(1교시) 시작 전: 1 반환
 * - 수업 중 / 쉬는 시간: 해당(또는 다음) 교시 번호 반환
 * - 마지막 수업(6교시) 종료 후: null 반환
 */
export const getCurrentPeriod = (): number | null => {
    const now = new Date();
    // 현재 시간을 분 단위로 환산 (예: 10:11 → 611분)
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 각 교시의 종료 시간 (분 단위)
    const periods = [
        { number: 1, end: 10 * 60 + 10 }, // 10:10
        { number: 2, end: 12 * 60 + 10 }, // 12:10
        { number: 3, end: 15 * 60 + 0 },  // 15:00
        { number: 4, end: 17 * 60 + 0 },  // 17:00
        { number: 5, end: 20 * 60 + 0 },  // 20:00
        { number: 6, end: 22 * 60 + 0 },  // 22:00
    ];

    // 1. 첫 수업 시작 전 (08:30 이전)
    if (currentMinutes < 8 * 60 + 30) {
        return 1;
    }

    // 2. 현재 시간과 각 교시의 종료 시간을 비교
    // 종료 시간과 같거나 이전이면 해당 교시, 지나면 다음 루프로 이동
    for (const period of periods) {
        if (currentMinutes <= period.end) {
            return period.number;
        }
    }

    // 3. 마지막 수업(6교시)이 종료된 이후 (22:00 이후)
    return null;
};
