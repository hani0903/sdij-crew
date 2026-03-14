// ─── 서비스 워커 등록 유틸리티 ───────────────────────────────────────────────
//
// 역할:
//   - Service Worker를 등록하고 ServiceWorkerRegistration 객체를 반환한다.
//   - FCM getToken()은 등록된 SW 객체를 받아야 올바른 SW와 연동되므로
//     Promise<ServiceWorkerRegistration>을 반드시 반환해야 한다.
//
// 주의:
//   - register()가 완료되기 전에 getToken()을 호출하면 Race Condition이 발생한다.
//     반드시 await register() 이후 getToken()을 호출해야 한다.

/**
 * Service Worker를 등록하고 registration 객체를 반환한다.
 *
 * @returns 등록된 ServiceWorkerRegistration
 * @throws SW가 지원되지 않는 환경이거나 등록에 실패한 경우 에러를 던진다.
 */
export async function register(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
        throw new Error('이 브라우저는 Service Worker를 지원하지 않습니다.');
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
    });

    if (import.meta.env.DEV) {
        console.log('[SW] 서비스 워커 등록 성공', registration);
    }

    return registration;
}