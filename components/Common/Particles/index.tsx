import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { defaultAnimation } from "./dataAnimation";

const Particle = () => {
	const particlesInit = useCallback(async (engine: Engine) => {
		await loadFull(engine);
	}, []);

	return (
		<Particles
			id="tsparticles-curr"
			init={particlesInit}
			options={defaultAnimation}
		/>
	);
};

export default Particle;
