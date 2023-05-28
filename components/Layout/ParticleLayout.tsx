import { useEffect, ReactNode, useState } from "react";
import Head from "next/head";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { generateRandomString } from "@/utils/encryption";
import { convertToLink } from "@/utils/convertToLink";
import Particles from "../Common/Particles";
import ConfirmationModal from "@/components/Atom/ConfirmationModal";

interface ParticleLayoutProps {
	children: ReactNode;
	title?: string;
	restrict?: boolean;
	appData?: any;
}

const ParticleLayout = ({
	children,
	title,
	restrict,
	appData,
}: ParticleLayoutProps) => {
	const session = useSession();
	const [restrictPage, setRestrictPage] = useState(true);
	const router = useRouter();
	const supabaseClient = useSupabaseClient();
	const [showVerification, setShowVerification] = useState(false);
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		const createAuthCodeAndRedirect = async () => {
			if (session?.user?.email && restrict) {
				if (verified) {
					const { redirectTo, redirect_to, id } = appData || {};
					if (redirect_to && id && redirectTo) {
						const redirectUrl = convertToLink(redirect_to);
						const authorizationCode = generateRandomString(30);
						const token = generateRandomString(128);
						const profileId = session.user.id;

						const { error } = await supabaseClient.from("tokens").insert([
							{
								code: authorizationCode,
								token,
								redirect_at: redirectTo,
								app_id: id,
								profile_id: profileId,
								expiration_date: new Date(Date.now() + 3600000).toISOString(),
							},
						]);

						if (error) {
							console.log("Error inserting authorization code: ", error);
						} else {
							router.push(
								`${redirectTo}?authorizationCode=${authorizationCode}&redirectUrl=${redirectUrl}`
							);
						}
					} else {
						setShowVerification(true);
					}
				} else {
					router.push("/home");
				}
			} else {
				setRestrictPage(false);
			}
		};

		createAuthCodeAndRedirect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, restrictPage, verified]);

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
				<Particles />
				<div className="max-w-[1440px] mx-auto">
					{!restrictPage && children}
					{showVerification && (
						<div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<ConfirmationModal
								title="Allow Application"
								onConfirm={() => setVerified(true)}>
								Are you sure you want to allow {appData?.domain} to access your
								email and name?
							</ConfirmationModal>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ParticleLayout;
