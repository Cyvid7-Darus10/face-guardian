export const registerServiceWorker = () => {
	if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) => {
					console.log("Service worker registered:", registration);
				})
				.catch((error) => {
					console.error("Service worker registration failed:", error);
				});
		});
	}
};
