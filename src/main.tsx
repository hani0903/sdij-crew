import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css';
import { register } from '@/libs/ServiceWorkerRegistration';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// ─── Service Worker 등록 (앱 로드 즉시, 인증과 무관하게) ─────────────────────
//
// 설계 원칙:
//   - SW 등록은 인증 여부와 관계없이 앱이 로드되는 순간 즉시 실행한다.
//   - FCM 토큰 발급/서버 등록은 인증 이후(usePushNotification)에만 실행한다.
//   - SW가 미리 activated 상태가 되어 있어야 getToken()이 정상 동작한다.
//
// vite-plugin-pwa 제거 이후:
//   - /sw.js가 더 이상 자동 생성/등록되지 않으므로 여기서 직접 등록한다.
//   - /service-worker.js가 유일한 SW로 scope 경합이 사라졌다.
if ('serviceWorker' in navigator) {
    // DOMContentLoaded 이후 등록하여 초기 페이지 렌더링을 블로킹하지 않는다.
    window.addEventListener('load', () => {
        register().catch((error) => {
            if (import.meta.env.DEV) {
                console.error('[SW] 앱 로드 시 서비스 워커 등록 실패:', error);
            }
        });
    });
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    );
}
