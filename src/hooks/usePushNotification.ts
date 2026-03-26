// ─── 푸시 알림 초기화 훅 ─────────────────────────────────────────────────────
//
// 역할:
//   1. 인증 상태(status)를 구독하여 'authenticated'로 전환될 때 FCM을 초기화한다.
//   2. 알림 권한을 요청한다.
//   3. 이미 등록된 SW를 재사용해 FCM 디바이스 토큰을 취득한다.
//      (SW 등록 자체는 main.tsx의 앱 로드 시점에 완료되어 있음)
//   4. 취득한 토큰을 서버에 전송한다.
//   5. 로그아웃('unauthenticated' 전환) 시 서버의 FCM 토큰을 삭제하고
//      Firebase의 로컬 토큰도 제거한다.
//
// 사용 위치:
//   - __root.tsx의 RootComponent에서 단 한 번 호출한다.
//   - 훅이 내부적으로 status를 구독하므로, 호출 측에서 조건부 렌더링이나
//     더미 컴포넌트 패턴을 쓸 필요가 없다.
//
// 설계 원칙:
//   - SW 등록(register)과 FCM 초기화를 분리한다.
//     SW 등록: main.tsx에서 앱 로드 즉시 실행 (인증 무관)
//     FCM 초기화: 인증 이후에만 실행 (토큰은 인증된 사용자와 연결되어야 함)
//   - useEffect cleanup에서 취소 플래그(cancelled)를 사용해 race condition을 방지한다.
//     예: 빠르게 로그인→로그아웃→로그인 시 이전 비동기 흐름이 덮어쓰는 문제 방지.

import { useEffect } from 'react';
import { deleteToken } from 'firebase/messaging';
import { messaging } from '@/core/notification/settingFCM';
import { useAuthStatus } from '@/stores/auth.store';
import { register } from '@/libs/ServiceWorkerRegistration';
import { getDeviceToken } from '@/libs/getDeviceToken';
import api from '@/libs/common/api';

/**
 * 사용자의 직접적인 클릭 액션에 의해 호출되어야 함
 * (예: 모달의 '확인' 버튼 onClick)
 */
async function requestAndRegisterToken() {
    try {
        // 1. 브라우저 권한 요청 팝업 실행
        // (사용자 액션 내부이므로 브라우저가 차단하지 않고 팝업을 띄움)
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            console.warn('[푸시 알림] 사용자가 권한을 거부했거나 닫았습니다.');
            return;
        }

        // 2. 서비스 워커 등록 확인
        // register()는 이전에 등록된 게 있다면 그걸 재사용함
        const registration = await register();

        // 3. FCM 토큰 취득
        const token = await getDeviceToken(registration);

        if (!token) {
            console.error('[푸시 알림] 토큰을 생성할 수 없습니다.');
            return;
        }

        // 4. 서버에 토큰 전송 (백엔드 API 호출)
        await api.patch('/my/fcm-token', { fcmToken: token });

        if (import.meta.env.DEV) {
            console.log('[푸시 알림] 성공적으로 등록되었습니다:', token);
        }

        alert('이제부터 알림을 받아보실 수 있습니다!');
    } catch (error) {
        console.error('[푸시 알림] 등록 프로세스 중 오류 발생:', error);
    }
}

/**
 * 인증 상태에 따라 푸시 알림 초기화와 토큰 정리를 수행하는 훅.
 * RootComponent에서 단 한 번 호출한다.
 */
export function usePushNotification(): void {
    const status = useAuthStatus();

    useEffect(() => {
        // 브라우저가 알림을 지원하지 않으면 아무것도 하지 않는다
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        // 인증된 경우: FCM 토큰 취득 및 서버 등록
        if (status === 'authenticated') {
            // race condition 방지용 취소 플래그
            // 예: 컴포넌트 언마운트나 status 재변경 시 이전 비동기 흐름을 무효화
            let cancelled = false;

            const setup = async () => {
                const result = await initializeFCM(cancelled);
                if (cancelled) return;

                // 권한이 거부(denied)된 경우 사용자에게 안내
                if (result === 'denied') {
                    // TODO: 프로젝트에서 사용하는 Modal UI를 호출하세요.
                    window.confirm(
                        "알림 권한이 차단되어 있습니다. 알림을 받으시려면 브라우저 설정에서 권한을 '허용'으로 변경해주세요. 설정 방법을 확인하시겠습니까?",
                    );
                }

                if (result === 'default') {
                    // TODO: 프로젝트에서 사용하는 Modal UI를 호출하세요.
                    const wantToEnable = window.confirm(
                        "알림 권한이 차단되어 있습니다. 알림을 받으시려면 브라우저 설정에서 권한을 '허용'으로 변경해주세요. 설정 방법을 확인하시겠습니까?",
                    );

                    if (wantToEnable) {
                        requestAndRegisterToken();
                    }
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
            void cleanupFCM();
        }
    }, [status]);
    // status가 변경될 때마다 실행됨.
    // 로그아웃 후 재로그인, RefreshToken 복구 등 어떤 인증 경로도 자동 처리됨.
}

// ─── 내부 함수: FCM 초기화 흐름 ───────────────────────────────────────────────
//
// SW 등록은 main.tsx에서 이미 완료되어 있다.
// 여기서는 이미 등록된 SW를 가져와 FCM 토큰 발급에 사용한다.

async function initializeFCM(cancelled: boolean): Promise<'granted' | 'denied' | 'default' | 'error' | void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // 현재 상태 확인
    let permission = Notification.permission;

    // 1. 이미 거부된 상태라면 바로 알림을 띄울 수 없음을 알림
    if (permission === 'denied') {
        return 'denied';
    }

    // 2. 권한 요청 (default 상태일 때 실행됨)
    try {
        permission = await Notification.requestPermission();
    } catch {
        return 'error';
    }

    if (cancelled) return;

    if (permission !== 'granted') {
        return permission; // 'denied' 또는 'default'
    }

    // Step 2: 이미 등록된 SW를 가져온다 (main.tsx에서 앱 로드 시 등록 완료)
    // register()는 모듈 레벨에서 Promise를 캐싱하므로 재등록 없이 즉시 반환된다.
    let registration: ServiceWorkerRegistration;
    try {
        registration = await register();
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[푸시 알림] Service Worker 등록 확인 실패:', error);
        }
        return;
    }

    // race condition 확인: 권한 요청 + SW 대기 중 status가 변경됐을 수 있음
    if (cancelled) return;

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

    if (cancelled) return;

    if (!token) {
        return;
    }

    // Step 4: FCM 토큰을 서버에 전송
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
