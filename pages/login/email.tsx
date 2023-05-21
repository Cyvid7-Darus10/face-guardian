import InputDetails from "@/components/Pages/Login/InputDetails";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

const Email = ({ appData }: { appData?: any }) => {
	return (
		<ParticleLayout title="Login" restrict={true} appData={appData}>
			<InputDetails />
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

export default Email;
