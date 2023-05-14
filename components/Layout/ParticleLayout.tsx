import { useEffect, ReactNode, useState } from "react";
import Head from "next/head";
import { useSession } from "@supabase/auth-helpers-react";
// import Particle from "../Common/Particles";
import { useRouter } from "next/router";

const ParticleLayout = ({
	children,
	title,
	restrict,
}: {
	children: ReactNode;
	title?: string;
	restrict?: boolean;
}) => {
	const session = useSession();
	const [restrictPage, setRestrictPage] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (session?.user?.email && restrict) {
			router.push("/home");
		} else {
			setRestrictPage(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	return (
		<>
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
				<title>{title ? `${title} | Face Guardian` : "Face Guardian"}</title>
			</Head>
			<div className="select-none">
				{/* <Particle /> */}
				<div className="max-w-[1440px] mx-auto">
					{!restrictPage && children}
				</div>
			</div>
		</>
	);
};

export default ParticleLayout;
