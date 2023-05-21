import Face from "@/components/Pages/Login/Face";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import type {
	InferGetServerSidePropsType,
	GetServerSideProps,
	GetServerSidePropsContext,
} from "next";

const Authenticate = ({ appData }: { appData?: string }): JSX.Element => {
	return (
		<ParticleLayout title="Authenticate" restrict={true} appData={appData}>
			<Face appData={appData} />
		</ParticleLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const appId = context.query.appId as string;

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
					appData: await data.appData,
				},
			};
		}
	}

	return {
		redirect: {
			permanent: false,
			destination: "/login",
		},
	};
};

export default Authenticate;
