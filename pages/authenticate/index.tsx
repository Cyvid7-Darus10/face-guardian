import Face from "@/components/Pages/Login/Face";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

const Authenticate = ({ appData }: { appData?: any }): JSX.Element => {
	return (
		<ParticleLayout title="Authenticate" restrict={true} appData={appData}>
			<Face appData={appData} />
		</ParticleLayout>
	);
};

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
	const appData = req.session.appData || null;
	if (!appData) {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		};
	}

	return {
		props: {
			appData,
		},
	};
}, sessionOptions);

export default Authenticate;
