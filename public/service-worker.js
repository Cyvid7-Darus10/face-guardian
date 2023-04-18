const { precacheAndRoute } = require("workbox-precaching");
const { registerRoute } = require("workbox-routing");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { ExpirationPlugin } = require("workbox-expiration");

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
	({ url }) => url.pathname.startsWith("/models"),
	new CacheFirst({
		cacheName: "models",
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				maxEntries: 10,
			}),
		],
	})
);

registerRoute(
	({ request }) =>
		request.destination === "script" || request.destination === "style",
	new StaleWhileRevalidate({
		cacheName: "static-resources",
	})
);
