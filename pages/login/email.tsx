import InputDetails from "@/components/Pages/Login/InputDetails";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

const Email = ({ appData }: { appData?: string }): JSX.Element => {
	return (
		<ParticleLayout title="Login" restrict={true} appData={appData}>
			<InputDetails />
		</ParticleLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const appId = context.query.appId as string;
	const redirectTo = context.query.redirectUrl as string;

	if (appId) {
		const response = await fetch(
			"https://www.face-guardian.com/api/authenticate",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ appId }),
			}
		);

		const data = await response.json();

		if (data.status) {
			return {
				props: {
					appData: { ...data.appData, redirectTo },
				},
			};
		}
	}

	return {
		props: {},
	};
};

export default Email;
