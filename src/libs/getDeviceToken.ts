// ─── FCM 디바이스 토큰 취득 유틸리티 ─────────────────────────────────────────
//
// 역할:
//   - 알림 권한을 확인한 뒤 FCM 디바이스 토큰을 발급받아 반환한다.
//   - SW 등록 객체(ServiceWorkerRegistration)를 받아 FCM과 연동한다.
//     → SW가 등록 완료되기 전에 호출하면 Race Condition이 발생하므로,
//       반드시 await register() 이후에 이 함수를 호출해야 한다.
//
// 설계 원칙:
//   - 이 함수는 토큰 취득만 담당한다. 서버 전송은 호출 측(훅)에서 처리한다.
//   - 예상 가능한 실패(권한 거부, 토큰 없음)는 null 반환으로 처리한다.
//   - 예외적 상황(Firebase 내부 오류 등)은 throw로 호출 측에 위임한다.

import { getToken } from 'firebase/messaging';
import { messaging } from '@/core/notification/settingFCM';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * FCM 디바이스 토큰을 취득한다.
 *
 * @param registration - await register()로 얻은 ServiceWorkerRegistration 객체.
 *   FCM은 이 SW를 통해 백그라운드 메시지를 수신하므로 반드시 전달해야 한다.
 * @returns 취득한 FCM 토큰. 권한이 없거나 토큰을 가져올 수 없으면 null 반환.
 * @throws Firebase getToken() 내부 오류 발생 시 에러를 던진다.
 */
export async function getDeviceToken(
    registration: ServiceWorkerRegistration,
): Promise<string | null> {
    // 알림 권한이 허용된 상태인지 먼저 확인한다.
    // 권한 요청(requestPermission)은 이 함수의 책임이 아니므로 호출 측에서 처리한다.
    if (Notification.permission !== 'granted') {
        if (import.meta.env.DEV) {
            console.warn('[FCM] 알림 권한이 허용되지 않아 토큰을 가져올 수 없습니다.');
        }
        return null;
    }

    const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
    });

    if (!token) {
        if (import.meta.env.DEV) {
            console.warn('[FCM] 토큰을 가져오지 못했습니다. 권한 또는 VAPID 키를 확인하세요.');
        }
        return null;
    }

    if (import.meta.env.DEV) {
        console.log('[FCM] 디바이스 토큰 취득 성공:', token);
    }

    return token;
}
