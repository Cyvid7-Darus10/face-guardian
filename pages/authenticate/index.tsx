import Face from "@/components/Pages/Login/Face";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

type Props = {
	clientData: any;
	appData: any;
};

const Authenticate = ({ clientData, appData }: Props): JSX.Element => {
	console.log("clientData", clientData);
	console.log("appData", appData);

	return (
		<ParticleLayout title="Authenticate" restrict={true}>
			<Face appData={appData} />
		</ParticleLayout>
	);
};

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
	const appData = req.session.appData || null;
	const clientData = req.session.clientData || null;
	if (!appData || !clientData) {
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
			clientData,
		},
	};
}, sessionOptions);

export default Authenticate;
