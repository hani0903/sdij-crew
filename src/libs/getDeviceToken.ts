// ─── FCM 디바이스 토큰 취득 유틸리티 ─────────────────────────────────────────
//
// 역할:
//   - 알림 권한을 확인한 뒤 FCM 디바이스 토큰을 발급받아 반환한다.
//   - SW 등록 객체(ServiceWorkerRegistration)를 받아 FCM과 연동한다.
//     → SW가 등록 완료되기 전에 호출하면 Race Condition이 발생하므로,
//       반드시 await register() 이후에 이 함수를 호출해야 한다.
//
// 토큰 재발급 전략:
//   - iOS PWA 재시작 또는 웹/앱 교차 로그인 후, 기존 push subscription이
//     stale(만료/불일치) 상태가 되어 getToken()이 throw하는 경우가 있다.
//   - Firebase 권장 대응: deleteToken()으로 stale subscription 제거 후 재시도.
//
// 설계 원칙:
//   - 이 함수는 토큰 취득만 담당한다. 서버 전송은 호출 측(훅)에서 처리한다.
//   - getToken() 실패 시 deleteToken() + 재시도로 stale subscription을 복구한다.
//   - 재시도 후에도 실패하면 throw로 호출 측에 위임한다.

import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from '@/core/notification/settingFCM';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * FCM 디바이스 토큰을 취득한다.
 *
 * @param registration - await register()로 얻은 ServiceWorkerRegistration 객체.
 *   FCM은 이 SW를 통해 백그라운드 메시지를 수신하므로 반드시 전달해야 한다.
 * @returns 취득한 FCM 토큰. 권한이 없거나 토큰을 가져올 수 없으면 null 반환.
 * @throws 재시도 후에도 Firebase getToken() 실패 시 에러를 던진다.
 */
export async function getDeviceToken(
    registration: ServiceWorkerRegistration,
): Promise<string | null> {
    // 알림 권한이 허용된 상태인지 먼저 확인한다.
    if (Notification.permission !== 'granted') {
        return null;
    }

    const options = {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
    };

    // 1차 시도: 정상 경로
    try {
        const token = await getToken(messaging, options);
        if (token) return token;

        // null 반환 시 stale subscription 가능성 → 동일 재시도 경로로 진행
    } catch {
        // getToken() throw 시 stale subscription 가능성 → 아래에서 deleteToken() 후 재시도
    }

    // 2차 시도: stale subscription 제거 후 재발급
    // 앱 재시작 또는 웹/앱 교차 사용 후 push subscription이 만료된 경우 필요
    try {
        await deleteToken(messaging);
    } catch {
        // 삭제할 토큰이 없는 경우 무시 (정상)
    }

    // deleteToken 후 새 토큰 요청 — 실패 시 throw로 호출 측에 위임
    const freshToken = await getToken(messaging, options);
    return freshToken || null;
}
