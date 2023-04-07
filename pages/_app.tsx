import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import useDeviceID from "@/store/useDeviceID";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
	const { setDeviceID } = useDeviceID();
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());
	const fpPromise = FingerprintJS.load();

	useEffect(() => {
		const getDeviceID = async () => {
			const fp = await fpPromise;
			const result = await fp.get();
			setDeviceID(result.visitorId);
		};
		getDeviceID();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
