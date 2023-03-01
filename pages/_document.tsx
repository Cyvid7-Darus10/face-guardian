import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="description"
					content="Facial authentication OAuth provider for secure and seamless authentication."
				/>
				<meta
					name="keywords"
					content="facial authentication, OAuth provider, secure authentication"
				/>
				<link rel="canonical" href="https://www.face-guardian.com/" />
				<meta
					property="og:title"
					content="Facial Authentication OAuth Provider - Face Guardian"
				/>
				<meta
					property="og:description"
					content="Facial authentication OAuth provider for secure and seamless authentication."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://www.face-guardian.com/" />
				<meta property="og:image" content="/fg-logo.png" />
				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:title"
					content="Facial Authentication OAuth Provider - Face Guardian"
				/>
				<meta
					property="twitter:description"
					content="Facial authentication OAuth provider for secure and seamless authentication."
				/>
				<meta property="twitter:image" content="/fg-logo.png" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicons/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
