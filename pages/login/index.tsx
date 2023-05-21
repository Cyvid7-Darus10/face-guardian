import Face from "@/components/Pages/Login/Face";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

const Login = ({ appData }: { appData?: any }) => {
	return (
		<ParticleLayout title="Login" restrict={true} appData={appData}>
			<Face />
		</ParticleLayout>
	);
};

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
	const appData = req.session.appData || null;

	return {
		props: {
			appData,
		},
	};
}, sessionOptions);

export default Login;
