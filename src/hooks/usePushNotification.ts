// ─── 푸시 알림 초기화 훅 ─────────────────────────────────────────────────────
//
// 역할:
//   1. 인증 상태(status)를 구독하여 'authenticated'로 전환될 때 자동으로 초기화.
//   2. 알림 권한을 요청한다.
//   3. Service Worker를 등록한다. (race condition 방지를 위해 await)
//   4. SW 등록 완료 후 FCM 디바이스 토큰을 취득한다.
//   5. 취득한 토큰을 서버에 전송한다.
//
// 사용 위치:
//   - __root.tsx의 RootComponent에서 단 한 번 호출한다.
//   - 훅이 내부적으로 status를 구독하므로, 호출 측에서 조건부 렌더링이나
//     더미 컴포넌트 패턴을 쓸 필요가 없다.
//
// 설계 원칙:
//   - 훅은 단일 책임(알림 초기화 조율)만 가지며, 세부 로직은 유틸로 위임한다.
//   - status 의존성을 useEffect에 명시하여 'authenticated' 전환 시 자동 실행.
//   - 이후 RefreshToken 도입으로 initializeAuth()가 성공하는 경우에도
//     별도 코드 변경 없이 자동으로 동작한다.

import { useEffect } from 'react';
import { useAuthStatus } from '@/stores/auth.store';
import { register } from '@/libs/ServiceWorkerRegistration';
import { getDeviceToken } from '@/libs/getDeviceToken';
import api from '@/libs/common/api';

/**
 * 인증 상태가 'authenticated'로 전환될 때 푸시 알림 초기화를 수행하는 훅.
 * RootComponent에서 단 한 번 호출하며, 훅이 status를 직접 구독한다.
 */
export function usePushNotification(): void {
    const status = useAuthStatus();

    useEffect(() => {
        // 인증되지 않은 상태거나 브라우저 미지원 환경에서는 실행하지 않음
        if (status !== 'authenticated') return;
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        void initializePushNotification();
    }, [status]);
    // status가 'authenticated'로 바뀔 때마다 실행됨.
    // 로그아웃 후 재로그인, RefreshToken 복구 등 어떤 인증 경로도 자동 처리됨.
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

    // Step 4: FCM 토큰을 서버에 전송
    try {
        await api.patch('/my/fcm-token', { fcmToken: token });
        if (import.meta.env.DEV) {
            console.log('[푸시 알림] 초기화 완료. FCM 토큰을 서버에 전송했습니다.');
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] 토큰 서버 전송 실패:', error);
        }
    }
}
