/**
 * FREIGHTFLOW SERVICE WORKER
 * Handles caching, offline functionality, and background sync
 */

const CACHE_VERSION = 'freightflow-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/booking.html',
  '/dashboard.html',
  '/tracking.html',
  '/about.html',
  '/faq.html',
  '/css/variables.css',
  '/css/style.css',
  '/css/booking.css',
  '/css/checkout.css',
  '/css/dashboard.css',
  '/css/testimonials.css',
  '/css/mobile.css',
  '/js/main.js',
  '/js/search.js',
  '/js/payment.js',
  '/js/tracking.js',
  '/js/animations.js',
  '/data/cities.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap',
  'https://unpkg.com/feather-icons',
  '/offline.html'
];

// API endpoints to cache with network-first strategy
const API_ROUTES = [
  '/api/trucks',
  '/api/bookings',
  '/api/tracking'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[ServiceWorker] Install failed:', err))
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('freightflow-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
            .map(name => {
              console.log('[ServiceWorker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and browser requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Strategy: Cache First for static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy: Network First for API calls
  if (API_ROUTES.some(route => request.url.includes(route))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy: Cache First with network fallback for images
  if (request.destination === 'image') {
    event.respondWith(cacheFirstImages(request));
    return;
  }

  // Default: Network First for all other requests
  event.respondWith(networkFirst(request));
});

// ===== CACHING STRATEGIES =====

// Cache First: Check cache, fallback to network
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Cache First failed:', error);
    return caches.match('/offline.html');
  }
}

// Network First: Try network, fallback to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Cache First for Images with separate cache
async function cacheFirstImages(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder image if available
    return new Response('', {
      status: 404,
      statusText: 'Image not found'
    });
  }
}

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  try {
    // Retrieve pending bookings from IndexedDB or localStorage
    const pendingBookings = await getPendingBookings();
    
    if (pendingBookings.length === 0) {
      return;
    }

    // Send bookings to server
    for (const booking of pendingBookings) {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        await removePendingBooking(booking.id);
      }
    }

    // Notify clients of successful sync
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          message: 'Bookings synced successfully'
        });
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Helper functions (mock implementations)
async function getPendingBookings() {
  // In production, read from IndexedDB
  return [];
}

async function removePendingBooking(id) {
  // In production, remove from IndexedDB
  console.log('Removing booking:', id);
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FreightFlow Update';
  const options = {
    body: data.body || 'New update available',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/assets/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => cache.addAll(urlsToCache))
    );
  }
});
