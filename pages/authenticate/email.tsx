import InputDetails from "@/components/Pages/Login/InputDetails";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

type Props = {
	appData: any;
	clientData: any;
};

const Register = ({ appData }: Props): JSX.Element => {
	return (
		<ParticleLayout title="Login" restrict={true} appData={appData}>
			<InputDetails />
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

export default Register;
