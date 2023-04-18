import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

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
