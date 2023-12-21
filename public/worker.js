
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

async function checkClientIsVisible() {
    const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });

    for (var i = 0; i < windowClients.length; i++) {
        if (windowClients[i].visibilityState === "visible") {
            return true;
        }
    }

    return false;
}


self.addEventListener('push', function (e) {
    const data = e.data.json();
    checkClientIsVisible().then(isOpen => {
        if (!isOpen) {
            self.registration.showNotification(
                data.title,
                {
                    body: data.body,
                }
            );
        }
    })
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
