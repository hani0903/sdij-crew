// ─── 푸시 알림 권한 요청 배너 ────────────────────────────────────────────────
//
// 역할:
//   - 알림 권한 상태(default / denied)에 따라 하단 고정 배너를 렌더링한다.
//   - 'default': "알림 허용하기" 버튼을 제공하며, 클릭(user gesture) 시
//     onRequestPermission()을 직접 호출하여 iOS Safari에서도 권한 다이얼로그가 열린다.
//   - 'denied': iOS에서 알림 권한을 재설정하는 방법을 안내한다.
//   - X 버튼으로 닫으면 sessionStorage에 dismissed 상태를 저장하여
//     새로고침 전까지 배너가 다시 표시되지 않는다.
//
// iOS user gesture 제약:
//   Notification.requestPermission()은 반드시 user gesture(클릭 등) 핸들러 내부에서
//   직접 호출되어야 iOS Safari에서 권한 다이얼로그가 정상 동작한다.
//   따라서 onRequestPermission은 async wrapper 없이 버튼 onClick에 직접 연결한다.

import { BellOff, X } from 'lucide-react';

const DISMISSED_KEY = 'notification-banner-dismissed';

interface NotificationPermissionBannerProps {
    status: 'default' | 'denied';
    /** 버튼 클릭(user gesture) 시 직접 호출되어야 함 — async wrapper 금지 */
    onRequestPermission: () => Promise<void>;
    onDismiss: () => void;
}

export function NotificationPermissionBanner({
    status,
    onRequestPermission,
    onDismiss,
}: NotificationPermissionBannerProps) {
    const handleDismiss = () => {
        sessionStorage.setItem(DISMISSED_KEY, 'true');
        onDismiss();
    };

    return (
        // BottomNavigation(md:hidden, ~69px) 위에 위치.
        // 모바일: bottom-[69px], 데스크탑(md 이상): BottomNav가 없으므로 bottom-0
        <div
            role="alert"
            aria-live="polite"
            className="fixed bottom-[69px] md:bottom-0 left-0 right-0 z-40 mx-auto max-w-screen-lg"
        >
            <div className="mx-4 mb-2 rounded-2xl border border-gray-2 bg-white shadow-lg">
                {status === 'default' ? (
                    <DefaultBanner onRequestPermission={onRequestPermission} onDismiss={handleDismiss} />
                ) : (
                    <DeniedBanner onDismiss={handleDismiss} />
                )}
            </div>
        </div>
    );
}

// ─── sessionStorage 유틸 ──────────────────────────────────────────────────────

/** 이번 세션에서 이미 배너를 닫은 경우 true 반환 */
export function isNotificationBannerDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) === 'true';
    } catch {
        return false;
    }
}

// ─── 내부 서브 컴포넌트 ───────────────────────────────────────────────────────

interface DefaultBannerProps {
    onRequestPermission: () => Promise<void>;
    onDismiss: () => void;
}

function DefaultBanner({ onRequestPermission, onDismiss }: DefaultBannerProps) {
    return (
        <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-point/10">
                <BellOff size={16} className="text-point" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black leading-snug">알림을 허용해 주세요</p>
                <p className="mt-0.5 text-xs text-gray-4 leading-relaxed">
                    알림을 허용하면 수업 관련 알림을 받을 수 있어요
                </p>
                {/* user gesture(onClick)에서 onRequestPermission을 직접 호출 */}
                <button
                    type="button"
                    onClick={onRequestPermission}
                    className="mt-3 w-full rounded-xl bg-point py-2 text-sm font-semibold text-white transition-opacity active:opacity-80"
                >
                    알림 허용하기
                </button>
            </div>

            <button
                type="button"
                onClick={onDismiss}
                aria-label="배너 닫기"
                className="flex-shrink-0 p-1 text-gray-3 hover:text-gray-4 transition-colors"
            >
                <X size={16} aria-hidden="true" />
            </button>
        </div>
    );
}

interface DeniedBannerProps {
    onDismiss: () => void;
}

function DeniedBanner({ onDismiss }: DeniedBannerProps) {
    return (
        <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-gray-1">
                <BellOff size={16} className="text-gray-3" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black leading-snug">알림이 차단되어 있습니다</p>
                <p className="mt-0.5 text-xs text-gray-4 leading-relaxed">
                    알림을 허용하려면 아래 순서로 설정을 변경해 주세요
                </p>
                <p className="mt-2 text-xs text-gray-4 leading-relaxed bg-gray-1 rounded-lg px-3 py-2">
                    설정 → Safari → 고급 → 웹사이트 설정 → 알림 → sdij.site 허용
                </p>
            </div>

            <button
                type="button"
                onClick={onDismiss}
                aria-label="배너 닫기"
                className="flex-shrink-0 p-1 text-gray-3 hover:text-gray-4 transition-colors"
            >
                <X size={16} aria-hidden="true" />
            </button>
        </div>
    );
}
