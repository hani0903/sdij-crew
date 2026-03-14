// ─── 서비스 워커 등록 유틸리티 ───────────────────────────────────────────────
//
// 역할:
//   - Service Worker를 등록하고 active 상태가 된 ServiceWorkerRegistration을 반환한다.
//   - FCM getToken()은 registration.active가 존재해야 하므로
//     반드시 SW가 activated 될 때까지 기다려야 한다.
//
// production 주의사항:
//   - vite-plugin-pwa(injectRegister: 'auto')가 /sw.js를 먼저 등록한다.
//   - 우리 /service-worker.js는 installing → waiting 후 skipWaiting()으로 activated됨.
//   - registration 객체를 받은 직후 active가 없을 수 있으므로 waitForActivation으로 대기.

const SW_ACTIVATION_TIMEOUT_MS = 10_000;

/**
 * Service Worker를 등록하고 active 상태가 된 registration 객체를 반환한다.
 *
 * @returns activated된 ServiceWorkerRegistration
 * @throws SW가 지원되지 않는 환경이거나 등록/활성화에 실패한 경우 에러를 던진다.
 */
export async function register(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
        throw new Error('이 브라우저는 Service Worker를 지원하지 않습니다.');
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
    });

    // 이미 active 상태인 경우 바로 반환 (두 번째 방문 이후)
    if (registration.active) {
        return registration;
    }

    // installing 또는 waiting 상태 — activated 될 때까지 대기
    // production에서 vite-plugin-pwa SW와 scope 경합 시
    // /service-worker.js의 self.skipWaiting()이 실행되고 나서야 activated됨
    await waitForActivation(registration);

    return registration;
}

// ─── 내부 함수: SW activated 대기 ─────────────────────────────────────────────

function waitForActivation(registration: ServiceWorkerRegistration): Promise<void> {
    // 이미 active인 경우 즉시 resolve (중복 체크)
    if (registration.active) return Promise.resolve();

    const worker = registration.installing ?? registration.waiting;
    if (!worker) {
        // installing/waiting 모두 없고 active도 없는 비정상 상태
        throw new Error('[SW] 활성화할 워커를 찾을 수 없습니다.');
    }

    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`[SW] 서비스 워커가 ${SW_ACTIVATION_TIMEOUT_MS}ms 내에 활성화되지 않았습니다.`));
        }, SW_ACTIVATION_TIMEOUT_MS);

        worker.addEventListener('statechange', () => {
            if (worker.state === 'activated') {
                clearTimeout(timeout);
                resolve();
            } else if (worker.state === 'redundant') {
                // 다른 SW가 이미 activate되어 현재 worker가 밀려난 경우
                // → /service-worker.js의 이전 버전이 이미 active일 수 있음
                clearTimeout(timeout);
                if (registration.active) {
                    resolve(); // active worker가 있으면 진행 가능
                } else {
                    reject(new Error('[SW] 서비스 워커가 redundant 상태가 되었습니다.'));
                }
            }
        });
    });
}
