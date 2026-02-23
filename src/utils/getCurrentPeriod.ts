/**
 * 현재 시간을 기준으로 진행 중인 교시 또는 다가올 교시를 반환합니다.
 * 수업 종료 직후(쉬는 시간)부터는 다음 교시를 반환합니다.
 */
export const getCurrentPeriod = (): string => {
    const now = new Date();
    // 현재 시간을 분 단위로 환산 (예: 10:11 -> 611분)
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 각 교시의 종료 시간 (분 단위)
    const periods = [
        { name: '1', end: 10 * 60 + 10 }, // 10:10
        { name: '2', end: 12 * 60 + 10 }, // 12:10
        { name: '3', end: 15 * 60 + 0 }, // 15:00
        { name: '4', end: 17 * 60 + 0 }, // 17:00
        { name: '5', end: 20 * 60 + 0 }, // 20:00
        { name: '6', end: 22 * 60 + 0 }, // 22:00
    ];

    // 1. 첫 수업 시작 전 (08:30 이전)
    if (currentMinutes < 8 * 60 + 30) {
        return '1교시';
    }

    // 2. 현재 시간과 각 교시의 종료 시간을 비교
    // 종료 시간과 같거나 이전이면 해당 교시, 지나면 다음 루프로 이동
    for (const period of periods) {
        if (currentMinutes <= period.end) {
            return `${period.name}교시`;
        }
    }

    // 3. 마지막 수업(6교시)이 종료된 이후 (22:00 이후)
    return '수업 종료';
};

// 사용 예시
// 현재 시각 10:11일 때 -> "2교시" 반환
// 현재 시각 14:00일 때 -> "3교시" 반환
console.log(`현재 시각 기준 세팅 필요 교시: ${getCurrentPeriod()}`);
