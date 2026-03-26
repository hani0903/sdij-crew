// ─── 푸시 알림 초기화 훅 ─────────────────────────────────────────────────────
//
// 역할:
//   1. 인증 상태(status)를 구독하여 'authenticated'로 전환될 때 FCM을 초기화한다.
//   2. 이미 'granted' 상태라면 자동으로 토큰을 취득하고 서버에 전송한다.
//   3. 'default' 또는 'denied' 상태라면 권한 요청 없이 notificationStatus를 반환하여
//      호출 측(배너 UI)이 user gesture 기반으로 권한을 요청하도록 위임한다.
//   4. 로그아웃('unauthenticated' 전환) 시 서버의 FCM 토큰을 삭제하고
//      Firebase의 로컬 토큰도 제거한다.
//
// 사용 위치:
//   - __root.tsx의 RootComponent에서 단 한 번 호출한다.
//
// 설계 원칙:
//   - iOS에서는 user gesture 없이 Notification.requestPermission()을 호출하면
//     권한 다이얼로그가 동작하지 않는다. 따라서 'default' 상태에서는 권한을
//     자동 요청하지 않고 notificationStatus를 반환하여 배너가 담당하도록 한다.
//   - requestAndRegisterToken은 export되어 배너 버튼의 onClick에서 직접 호출된다.
//   - useEffect cleanup에서 취소 플래그(cancelled)를 사용해 race condition을 방지한다.

import { useEffect, useState } from 'react';
import { deleteToken } from 'firebase/messaging';
import { messaging } from '@/core/notification/settingFCM';
import { useAuthStatus } from '@/stores/auth.store';
import { register } from '@/libs/ServiceWorkerRegistration';
import { getDeviceToken } from '@/libs/getDeviceToken';
import api from '@/libs/common/api';

export type NotificationStatus = 'granted' | 'default' | 'denied' | null;

/**
 * 사용자의 직접적인 클릭 액션에 의해 호출되어야 함.
 * 배너의 "알림 허용하기" 버튼 onClick에서 직접 호출한다.
 *
 * @returns 최종 권한 상태. 호출 측에서 status 갱신에 활용할 수 있다.
 */
export async function requestAndRegisterToken(): Promise<NotificationStatus> {
    try {
        // 1. 브라우저 권한 요청 팝업 실행
        // (user gesture 내부이므로 iOS Safari도 팝업을 정상적으로 띄움)
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            console.warn('[푸시 알림] 사용자가 권한을 거부했거나 닫았습니다.');
            return permission as NotificationStatus;
        }

        // 2. 서비스 워커 등록 확인
        // register()는 이전에 등록된 게 있다면 그걸 재사용함
        const registration = await register();

        // 3. FCM 토큰 취득
        const token = await getDeviceToken(registration);

        if (!token) {
            console.error('[푸시 알림] 토큰을 생성할 수 없습니다.');
            return 'granted';
        }

        // 4. 서버에 토큰 전송 (백엔드 API 호출)
        await api.patch('/my/fcm-token', { fcmToken: token });

        if (import.meta.env.DEV) {
            console.log('[푸시 알림] 성공적으로 등록되었습니다:', token);
        }

        return 'granted';
    } catch (error) {
        console.error('[푸시 알림] 등록 프로세스 중 오류 발생:', error);
        return Notification.permission as NotificationStatus;
    }
}

// ─── 반환 타입 ────────────────────────────────────────────────────────────────

interface UsePushNotificationResult {
    /**
     * 현재 알림 권한 상태.
     * - null: 브라우저가 알림을 지원하지 않거나 아직 초기화되지 않은 상태
     * - 'granted': 권한 허용됨
     * - 'default': 아직 권한 요청 전 (배너를 통해 user gesture로 요청 필요)
     * - 'denied': 사용자가 차단함 (설정에서 직접 변경해야 함)
     */
    notificationStatus: NotificationStatus;
    /** 배너에서 권한 요청 후 status를 외부에서 갱신하기 위한 setter */
    setNotificationStatus: (status: NotificationStatus) => void;
}

/**
 * 인증 상태에 따라 푸시 알림 초기화와 토큰 정리를 수행하는 훅.
 * RootComponent에서 단 한 번 호출한다.
 */
export function usePushNotification(): UsePushNotificationResult {
    const status = useAuthStatus();
    const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>(null);

    useEffect(() => {
        // 브라우저가 알림을 지원하지 않으면 아무것도 하지 않는다
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        // 인증된 경우: FCM 초기화
        if (status === 'authenticated') {
            // race condition 방지용 취소 플래그
            // 예: 컴포넌트 언마운트나 status 재변경 시 이전 비동기 흐름을 무효화
            let cancelled = false;

            const setup = async () => {
                const result = await initializeFCM(cancelled);
                if (cancelled) return;

                if (result != null) {
                    setNotificationStatus(result);
                }
            };

            void setup();

            // cleanup: 다음 status 변경 또는 언마운트 시 이전 흐름 취소
            return () => {
                cancelled = true;
            };
        }

        // 비인증 상태로 전환된 경우: 로그아웃 처리 — FCM 토큰 정리
        if (status === 'unauthenticated') {
            setNotificationStatus(null);
            void cleanupFCM();
        }
    }, [status]);

    return { notificationStatus, setNotificationStatus };
}

// ─── 내부 함수: FCM 초기화 흐름 ───────────────────────────────────────────────
//
// 변경 사항:
//   - 'default' 상태일 때 Notification.requestPermission()을 호출하지 않는다.
//     권한 요청은 배너 버튼(user gesture)에서 requestAndRegisterToken()을 통해 이루어진다.
//   - 'granted' 상태일 때만 자동으로 토큰을 취득하고 서버에 전송한다.

async function initializeFCM(cancelled: boolean): Promise<NotificationStatus | void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const permission = Notification.permission;

    // 1. 이미 거부된 상태라면 배너에서 안내만 하고 끝
    if (permission === 'denied') {
        return 'denied';
    }

    // 2. 아직 권한 요청 전 → 자동으로 요청하지 않고 상태만 반환
    //    배너의 user gesture(onClick)에서 requestAndRegisterToken()이 담당한다
    if (permission === 'default') {
        return 'default';
    }

    // 3. 이미 허용된 상태 → 자동으로 토큰 취득 및 서버 전송
    // SW 등록은 main.tsx에서 이미 완료되어 있다.
    let registration: ServiceWorkerRegistration;
    try {
        registration = await register();
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] Service Worker 등록 확인 실패:', error);
        }
        return;
    }

    if (cancelled) return;

    let token: string | null;
    try {
        token = await getDeviceToken(registration);
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] FCM 토큰 취득 중 오류 발생:', error);
        }
        return;
    }

    if (cancelled) return;

    if (!token) {
        return 'granted';
    }

    try {
        await api.patch('/my/fcm-token', { fcmToken: token });
        if (import.meta.env.DEV) {
            console.log('[푸시 알림] 초기화 완료. FCM 토큰을 서버에 전송했습니다.');
            console.log(`token: ${token}`);
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] 토큰 서버 전송 실패:', error);
        }
    }

    return 'granted';
}

// ─── 내부 함수: 로그아웃 시 FCM 토큰 정리 ────────────────────────────────────
//
// 로그아웃 후에도 해당 기기에 푸시가 가는 버그를 방지한다.
// 서버 토큰 삭제 → Firebase 로컬 토큰 삭제 순으로 처리한다.
// 각 단계의 실패가 전체를 중단시키지 않도록 개별 try/catch로 처리한다.

async function cleanupFCM(): Promise<void> {
    // 알림 권한이 없으면 토큰 자체가 없으므로 정리할 것이 없다
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    // Step 1: 서버에서 FCM 토큰 삭제
    // 서버가 이 기기로 푸시를 보내지 않도록 먼저 서버 측 토큰을 제거한다.
    try {
        await api.delete('/my/fcm-token');
        if (import.meta.env.DEV) {
            console.log('[푸시 알림] 서버 FCM 토큰 삭제 완료.');
        }
    } catch (error) {
        // 401(이미 로그아웃됨) 또는 404(토큰 없음) 등은 정상 케이스로 볼 수 있음
        if (import.meta.env.DEV) {
            console.warn('[푸시 알림] 서버 FCM 토큰 삭제 실패 (무시):', error);
        }
    }

    // Step 2: Firebase 로컬 토큰 삭제
    // 클라이언트 측 push subscription을 해제하여 stale 토큰이 남지 않도록 한다.
    try {
        await deleteToken(messaging);
        if (import.meta.env.DEV) {
            console.log('[푸시 알림] Firebase 로컬 FCM 토큰 삭제 완료.');
        }
    } catch (error) {
        // 토큰이 없는 경우 deleteToken은 throw할 수 있으므로 무시한다
        if (import.meta.env.DEV) {
            console.warn('[푸시 알림] Firebase 로컬 FCM 토큰 삭제 실패 (무시):', error);
        }
    }
}
