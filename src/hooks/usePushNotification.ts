// ─── 푸시 알림 초기화 훅 ─────────────────────────────────────────────────────
//
// 역할:
//   1. 알림 권한을 요청한다.
//   2. Service Worker를 등록한다. (race condition 방지를 위해 await)
//   3. SW 등록 완료 후 FCM 디바이스 토큰을 취득한다.
//   4. (TODO) 취득한 토큰을 서버에 전송한다.
//
// 사용 위치:
//   - __root.tsx의 RootComponent에서 useEffect 대신 이 훅을 호출한다.
//
// 설계 원칙:
//   - 훅은 단일 책임(알림 초기화 조율)만 가지며, 세부 로직은 유틸로 위임한다.
//   - 브라우저 지원 여부와 권한 상태를 단계별로 검증하여 안전하게 진행한다.
//   - 앱 마운트 시 1회만 실행되며, 결과를 외부에 노출하지 않는다.

import { useEffect } from 'react';
import { register } from '@/libs/ServiceWorkerRegistration';
import { getDeviceToken } from '@/libs/getDeviceToken';

/**
 * 앱 마운트 시 푸시 알림 초기화를 수행하는 훅.
 * __root.tsx의 RootComponent에서 단 한 번 호출한다.
 */
export function usePushNotification(): void {
    useEffect(() => {
        // 서버 사이드 렌더링 환경 또는 알림 API 미지원 브라우저 조기 반환
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return;
        }

        void initializePushNotification();
    }, []);
}

// ─── 내부 함수: 알림 초기화 흐름 ─────────────────────────────────────────────

async function initializePushNotification(): Promise<void> {
    // Step 1: 알림 권한 요청
    // 이미 결정된 권한('granted' | 'denied')이면 브라우저가 프롬프트를 띄우지 않는다.
    let permission: NotificationPermission;
    try {
        permission = await Notification.requestPermission();
    } catch (error) {
        // Firefox 구형 버전은 콜백 기반 API만 지원하는 경우가 있음
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] 권한 요청 중 오류 발생:', error);
        }
        return;
    }

    if (permission !== 'granted') {
        if (import.meta.env.DEV) {
            console.info('[푸시 알림] 권한이 거부되었습니다. 알림을 초기화하지 않습니다.');
        }
        return;
    }

    // Step 2: Service Worker 등록 (완료를 반드시 await)
    // getDeviceToken()은 SW 등록 객체가 필요하므로 순서가 보장되어야 한다.
    let registration: ServiceWorkerRegistration;
    try {
        registration = await register();
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] Service Worker 등록 실패:', error);
        }
        return;
    }

    // Step 3: FCM 디바이스 토큰 취득
    let token: string | null;
    try {
        token = await getDeviceToken(registration);
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] FCM 토큰 취득 중 오류 발생:', error);
        }
        return;
    }

    if (!token) {
        return;
    }

    // Step 4: 토큰을 서버로 전송
    // TODO: FCM 토큰을 서버에 전송하여 사용자와 디바이스를 연결한다.
    //   - API 엔드포인트 확정 후 아래 주석을 해제하고 구현한다.
    //   - 예시:
    //
    //   try {
    //     await api.post('/notifications/device-token', { token });
    //   } catch (error) {
    //     if (import.meta.env.DEV) {
    //       console.error('[푸시 알림] 토큰 서버 전송 실패:', error);
    //     }
    //   }
    if (import.meta.env.DEV) {
        console.log('[푸시 알림] 초기화 완료. 토큰을 서버에 전송할 준비가 되었습니다.');
    }
}
