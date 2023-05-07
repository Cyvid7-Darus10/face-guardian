import Face from "@/components/Pages/Login/Face";
import ParticleLayout from "@/components/Layout/ParticleLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

type Props = {
	clientId: string;
	clientSecret: string;
};

const Authenticate = ({ clientId, clientSecret }: Props): JSX.Element => {
	console.log(clientId, clientSecret, "KEYS");
	return (
		<ParticleLayout title="Authenticate" restrict={true}>
			<Face />
		</ParticleLayout>
	);
};

export const getServerSideProps = withIronSessionSsr(async function ({
	req,
	res,
}) {
	const clientId = req.session.clientId || null;
	const clientSecret = req.session.clientSecret || null;

	if (!clientId || !clientSecret) {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
		};
	}

	return {
		props: {
			clientId,
			clientSecret,
		},
	};
},
sessionOptions);

export default Authenticate;
