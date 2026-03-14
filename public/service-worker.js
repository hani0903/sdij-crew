const CACHE_NAME = 'v1-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/since-128x128.png',
    '/icons/since-144x144.png',
    '/icons/since-152x152.png',
    '/icons/since-192x192.png',
    '/icons/since-256x256.png',
    '/icons/since-512x512.png',
    // '/icon/Favicon.png',
    // '/icon/apple-touch-icon-180x180.png',
];

// 캐시 저장 함수
const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
    self.skipWaiting(); // 캐시 완료 후 즉시 활성화
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
            .then(() => self.clients.claim()), // ← 이게 있어야 새 SW가 즉시 페이지를 제어
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        }),
    );
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const notification = data.notification ?? data; // FCM 포맷에 따라 다를 수 있음

    const title = notification.title ?? '알림';
    const options = {
        body: notification.body ?? '',
        icon: '/icons/since-192x192.png', // 알림 아이콘
        badge: '/icons/since-128x128.png', // 안드로이드 상단바 아이콘
        data: data.data ?? {}, // 클릭 시 전달할 커스텀 데이터
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

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

firebase.initializeApp({
    apiKey: '...',
    projectId: '...',
    messagingSenderId: '...',
    appId: '...',
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification;
    self.registration.showNotification(title, { body });
});
