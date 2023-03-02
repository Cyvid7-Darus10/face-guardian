import Particle from "../Common/Particles";
import Head from "next/head";

const ParticleLayout = ({ children, title }) => {
	return (
		<>
			<Head>
				<title>{title ? `${title} | ` : ""} Face Guardian</title>
			</Head>
			<div>
				<Particle />
				{children}
			</div>
		</>
	);
};

export default ParticleLayout;
