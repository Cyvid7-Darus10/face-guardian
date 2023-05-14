import InputDetails from "@/components/Pages/Login/InputDetails";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

type Props = {
	appData: any;
	clientData: any;
};

const Register = ({ appData, clientData }: Props): JSX.Element => {
	console.log(appData, clientData, "KEYS");
	return (
		<ParticleLayout title="Login" restrict={true}>
			<InputDetails />
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

export default Register;
