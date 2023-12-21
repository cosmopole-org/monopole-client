
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

self.addEventListener('push', function (e) {
    const data = e.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: data.body,
        }
    );
})

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});
