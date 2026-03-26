// 빌드 배포 시 이 버전을 올리면 activate에서 구 캐시를 자동으로 삭제한다.
// index.html이 새 JS 파일명을 참조하기 전에 구 캐시가 남아있으면
// "Failed to load module script: text/html" MIME 에러가 발생하기 때문이다.
const CACHE_NAME = 'v2-assets';

// install: 정적 아이콘만 사전 캐싱 — index.html은 절대 캐싱하지 않는다.
// index.html을 캐싱하면 새 빌드 배포 후 구 JS 해시를 참조하는 stale HTML이
// 서빙되어 MIME 에러로 앱 전체가 흰 화면이 되는 버그가 발생한다.
const PRECACHE_ASSETS = [
    '/manifest.json',
    '/icons/since-128x128.png',
    '/icons/since-144x144.png',
    '/icons/since-152x152.png',
    '/icons/since-192x192.png',
    '/icons/since-256x256.png',
    '/icons/since-512x512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log(`Deleting old cache: ${cache}`);
                            return caches.delete(cache);
                        }
                    }),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // ── 1. 네비게이션 요청(HTML) → Network First ──────────────────────────────
    // index.html은 항상 서버에서 최신 버전을 가져온다.
    // 캐싱하면 새 빌드 배포 후 구 JS 해시를 참조해 MIME 에러가 발생한다.
    // 오프라인일 때만 캐시 fallback을 사용한다.
    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
        return;
    }

    // ── 2. Vite content-hash 에셋(/assets/) → Cache First ────────────────────
    // 파일명에 해시가 포함되어 있어 내용이 동일하면 URL도 동일하다 (불변).
    // 한 번 캐싱하면 영구적으로 재사용해도 안전하다.
    if (url.pathname.startsWith('/assets/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                });
            }),
        );
        return;
    }

    // ── 3. 나머지 요청(API 등) → Network Only ────────────────────────────────
    // API 응답은 항상 최신이어야 하므로 캐싱하지 않는다.
    event.respondWith(fetch(request));
});

// push 이벤트 핸들러를 제거한 이유:
//   Firebase SDK(firebase-messaging-compat.js)가 push 이벤트를 가로채
//   onBackgroundMessage 콜백으로 전달한다.
//   커스텀 push 핸들러를 같이 두면 동일한 메시지에 대해 알림이 2회 발생하고,
//   백엔드가 notification 페이로드를 포함하면 FCM 자동 알림까지 더해져 3회가 된다.
//   onBackgroundMessage 콜백이 등록되어 있으면 FCM 자동 알림이 억제되므로
//   아래 onBackgroundMessage 단독으로 알림 1회만 표시된다.

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // 이미 열린 탭이 있으면 포커스
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            // 없으면 새 탭 열기
            return clients.openWindow('/');
        }),
    );
});

// Service Worker는 Vite 번들러를 거치지 않으므로 import.meta.env 사용 불가
// Firebase compat SDK를 importScripts()로 로드하여 사용
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase 클라이언트 설정값은 공개 키이므로 직접 삽입 허용
const firebaseConfig = {
    apiKey: 'AIzaSyCq6GpDQWUPf3nyzQxq-NXRfiIurtMXK4U',
    projectId: 'sdij-9c42f',
    messagingSenderId: '738089770933',
    appId: '1:738089770933:web:f72516712ecd066c7dc3fc',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
    const { title = '알림', body = '', ...rest } = payload.data ?? {};
    const options = {
        body: notification.body ?? '',
        icon: '/icons/since-192x192.png',
        badge: '/icons/since-128x128.png',
        data: rest,
    };
    self.registration.showNotification(title, options);
});
