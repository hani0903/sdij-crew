// ─── 루트 라우트 ─────────────────────────────────────────────────────────────
//
// 역할:
//   1. QueryClientProvider, 전역 레이아웃 제공
//   2. 앱 최초 진입 시 AuthInitializer를 통해 인증 상태 초기화 (새로고침 복구)
//   3. AuthGuard를 통해 미인증 사용자를 카카오 로그인 페이지로 리다이렉트
//
// 라우트 가드 전략:
//   - status === 'idle'    : 초기화 중이므로 로딩 표시 (깜빡임 방지)
//   - status === 'authenticated'    : 정상 렌더링
//   - status === 'unauthenticated'  : 공개 라우트면 통과, 보호 라우트면 카카오 로그인으로

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router';
import { queryClient } from '../providers/query-client';
import BottomNavigation from '../components/ui/BottomNavigation';
import Header from '../components/ui/Header';
import { useAuthStore } from '@/stores/auth.store';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';
import * as serviceWorkerRegistration from '@/libs/ServiceWorkerRegistration';

export const Route = createRootRoute({
    component: RootComponent,
});

// ─── 공개 라우트 목록 ─────────────────────────────────────────────────────────
// 이 경로들은 미인증 상태에서도 접근 가능 (로그인 콜백 등).
// '/'는 정확히 일치해야 함 — startsWith('/')는 모든 경로에서 true가 되므로 사용 불가.
const EXACT_PUBLIC_PATHS = ['/'] as const;
const PREFIX_PUBLIC_PATHS = ['/login/oauth2/code/kakao', '/docs'] as const;

function isPublicPath(pathname: string): boolean {
    if (EXACT_PUBLIC_PATHS.some((p) => pathname === p)) return true;
    return PREFIX_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

// ─── Auth 초기화 컴포넌트 ────────────────────────────────────────────────────
// 앱 최초 마운트 시 인증 상태를 복구 시도.
// @future RefreshToken 도입 시 initializeAuth()가 refresh()를 호출해 자동 복구됨.
function AuthInitializer() {
    const initializeAuth = useAuthStore((s) => s.initializeAuth);

    useEffect(() => {
        void initializeAuth();
    }, [initializeAuth]);

    return null;
}

// ─── 라우트 가드 컴포넌트 ────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
    const status = useAuthStore((s) => s.status);
    const location = useLocation();

    const shouldRedirect = status === 'unauthenticated' && !isPublicPath(location.pathname);

    // 렌더 중 side effect 금지 — useEffect로 리다이렉트 처리
    useEffect(() => {
        if (!shouldRedirect) return;

        // 로그인 후 복귀할 경로 저장
        sessionStorage.setItem('redirectAfterLogin', location.pathname);

        // 카카오 OAuth 인가 URL로 이동
        // router.navigate 대신 window.location.href 사용:
        // 카카오 인가 서버는 외부 도메인이므로 TanStack Router로 이동 불가.
        const kakaoClientId = 'f12e62fc3162b94fd60fcd0e2b706dd6';
        const redirectUri = import.meta.env.PROD
            ? 'https://www.sdij.site/login/oauth2/code/kakao'
            : 'http://localhost:5173/login/oauth2/code/kakao';

        window.location.href =
            `https://kauth.kakao.com/oauth/authorize` +
            `?client_id=${kakaoClientId}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=profile_nickname%20account_email`;
    }, [shouldRedirect, location.pathname]);

    // 초기화 중 또는 리다이렉트 대기 중 — 스피너 표시
    if (status === 'idle' || shouldRedirect) {
        return (
            <div
                className="w-full h-full flex items-center justify-center"
                aria-label={status === 'idle' ? '앱 초기화 중' : '로그인 페이지로 이동 중'}
            >
                <CircularLoadingSpinner />
            </div>
        );
    }

    return <>{children}</>;
}

// ─── 루트 컴포넌트 ────────────────────────────────────────────────────────────

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            {/* 앱 최초 마운트 시 인증 상태 초기화 */}
            <AuthInitializer />

            <div className="w-screen h-dvh bg-gray-200 flex justify-center">
                <div className="w-full bg-white h-full flex flex-col">
                    <Header
                        title="시대인재"
                        ctaLabel="로그인"
                        onCtaClick={() => {
                            if (import.meta.env.PROD) {
                                window.location.href =
                                    'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=https://www.sdij.site/login/oauth2/code/kakao&scope=profile_nickname account_email';
                            } else {
                                window.location.href =
                                    'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=http://localhost:5173/login/oauth2/code/kakao&scope=profile_nickname account_email';
                            }
                        }}
                    />
                    <div className="w-full flex-col flex flex-1 min-h-0 overflow-y-auto">
                        <AuthGuard>
                            <Outlet />
                        </AuthGuard>
                    </div>
                    <BottomNavigation />
                </div>
            </div>
        </QueryClientProvider>
    );
}

serviceWorkerRegistration.register();
