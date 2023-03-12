import { useState } from "react";
import Face from "../../components/Pages/Register/Face";
import InputDetails from "../../components/Pages/Register/InputDetails";
import ParticleLayout from "../../components/Layout/ParticleLayout";

const Register = () => {
	const [isFaceStored, setIsFaceStored] = useState(false);
	return (
		<ParticleLayout title="Register">
			{isFaceStored ? (
				<InputDetails />
			) : (
				<Face setIsFaceStored={setIsFaceStored} />
			)}
		</ParticleLayout>
	);
};

export default Register;
