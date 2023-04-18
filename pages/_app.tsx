import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	useEffect(() => {
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
		} else {
			console.log("REGISTERED SERVICE WORKER");
		}
	}, []);

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}>
			<Component {...pageProps} />
			<ToastContainer />
		</SessionContextProvider>
	);
}
