import Particle from "../Common/Particles";
import Head from "next/head";

const ParticleLayout = ({ children, title }) => {
	return (
		<>
			<Head>
				<title>
					{title ? `${title} | ` : ""} {process.env.NEXT_PUBLIC_SITE_NAME}
				</title>
			</Head>
			<div>
				<Particle />
				{children}
			</div>
		</>
	);
};

export default ParticleLayout;
