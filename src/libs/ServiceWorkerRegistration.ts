// ─── 서비스 워커 등록 유틸리티 ───────────────────────────────────────────────
//
// 역할:
//   - Service Worker를 등록하고 active 상태가 된 ServiceWorkerRegistration을 반환한다.
//   - FCM getToken()은 registration.active가 존재해야 하므로
//     반드시 SW가 activated 될 때까지 기다려야 한다.
//
// 변경 이력:
//   - vite-plugin-pwa 제거 이후, /sw.js와의 scope 경합이 사라졌다.
//   - 따라서 /service-worker.js가 단독으로 등록·활성화되는 단순한 흐름이 된다.
//
// 싱글톤 전략:
//   - 앱 로드 즉시 등록하되, 이미 등록된 SW가 있으면 재사용한다.
//   - Promise를 모듈 레벨에서 캐싱해 중복 등록 호출을 방지한다.

const SW_ACTIVATION_TIMEOUT_MS = 10_000;

// 모듈 레벨에서 등록 Promise를 캐싱한다.
// register()를 여러 번 호출해도 브라우저 navigator.serviceWorker.register()는
// 한 번만 실제 등록이 일어나지만, waitForActivation() 로직이 중복 실행되는 것을 막기 위해
// Promise 자체를 재사용한다.
let registrationPromise: Promise<ServiceWorkerRegistration> | null = null;

/**
 * Service Worker를 등록하고 active 상태가 된 registration 객체를 반환한다.
 * 이미 등록이 진행 중이거나 완료된 경우 캐싱된 Promise를 반환한다.
 *
 * @returns activated된 ServiceWorkerRegistration
 * @throws SW가 지원되지 않는 환경이거나 등록/활성화에 실패한 경우 에러를 던진다.
 */
export function register(): Promise<ServiceWorkerRegistration> {
    // 브라우저가 Service Worker API를 지원하는지 확인
    if (!('serviceWorker' in navigator)) {
        return Promise.reject(new Error('이 브라우저는 Service Worker를 지원하지 않습니다.'));
    }

    // 이미 등록 중이거나 완료된 Promise가 있으면 재사용 (중복 등록 방지)
    if (registrationPromise) {
        return registrationPromise;
    }

    registrationPromise = _doRegister();
    return registrationPromise;
}

// ─── 내부 함수: 실제 등록 수행 ────────────────────────────────────────────────

async function _doRegister(): Promise<ServiceWorkerRegistration> {
    // 이미 등록된 SW가 있으면 재사용한다 (새로고침 이후 두 번째 방문)
    const existing = await navigator.serviceWorker.getRegistration('/');
    if (existing?.active) {
        return existing;
    }

    // SW 파일을 등록한다 (installing 상태로 진입)
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
    });

    // 이미 active 상태인 경우 즉시 반환 (두 번째 방문 이후 또는 빠른 install)
    if (registration.active) {
        return registration;
    }

    // installing → waiting → activated 될 때까지 대기
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
        // 지정된 시간 안에 활성화되지 않으면 실패 처리
        const timeout = setTimeout(() => {
            reject(new Error(`[SW] 서비스 워커가 ${SW_ACTIVATION_TIMEOUT_MS}ms 내에 활성화되지 않았습니다.`));
        }, SW_ACTIVATION_TIMEOUT_MS);

        worker.addEventListener('statechange', () => {
            if (worker.state === 'activated') {
                clearTimeout(timeout);
                resolve();
            } else if (worker.state === 'redundant') {
                // 다른 SW 버전이 이미 active가 된 경우 현재 worker가 밀려남
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
