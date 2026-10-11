// sw.js - Service Worker for Auto Update Cache Control
const CACHE_NAME = 'my-business-hisab-v2';

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কার অ্যাক্টিভ করতে বাধ্য করবে
});

// Activate Event & Clear Old Cache
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing Old Cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Network First Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // সার্ভার থেকে নতুন আপডেট পেলে তা রিটার্ন করবে
                return networkResponse;
            })
            .catch(() => {
                // অফলাইনে থাকলে ক্যাশ থেকে লোড করবে
                return caches.match(event.request);
            })
    );
});
