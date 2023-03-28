import { useState } from "react";
import Face from "../../components/Pages/Register/Face";
import InputDetails from "../../components/Pages/Register/InputDetails";
import ParticleLayout from "../../components/Layout/ParticleLayout";

const Register = () => {
	const [faceDescriptors, setFaceDescriptors] = useState(false);
	return (
		<ParticleLayout title="Register" restrict={true}>
			{faceDescriptors ? (
				<InputDetails />
			) : (
				<Face setFaceDescriptors={setFaceDescriptors} />
			)}
		</ParticleLayout>
	);
};

export default Register;
