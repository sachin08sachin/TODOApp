import withPWA from 'next-pwa';

const runtimeCaching = [
  {
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'http-cache',
      expiration: { maxEntries: 150, maxAgeSeconds: 24 * 60 * 60 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
  urlPattern: /^\/$/,       // matches "/"
  handler: 'NetworkFirst',  // fetch from network first, then fallback to cache
  options: {
    cacheName: 'main-page-cache',
    expiration: { maxEntries: 1, maxAgeSeconds: 24 * 60 * 60 },
    cacheableResponse: { statuses: [0, 200] },
  },
}
,
  {
    urlPattern: /.*/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'page-cache',
    },
  },
];

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  fallbacks: {
    document: '/offline.html',
  },
});
