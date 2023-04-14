import { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { checkInputFields, registerUser } from "./utils";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const InputDetails = ({ faceDescriptors }: { faceDescriptors: any }) => {
	const supabaseClient = useSupabaseClient();
	const fpPromise = FingerprintJS.load();
	const [loading, setLoading] = useState(false);

	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const onSubmit = async () => {
		setLoading(true);
		if (!checkInputFields(userData)) return;
		await registerUser(userData, supabaseClient, fpPromise, faceDescriptors);
		setLoading(false);
	};

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
			<Image
				src="/fg-logo.png"
				alt="fg-logo"
				width={300}
				height={300}
				className="z-50 w-full lg:w-1/3"
			/>
			<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
				<InputFields userData={userData} setUserData={setUserData} />
				<Button
					onClick={onSubmit}
					variant="contained"
					color="primary"
					disabled={loading}
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full ">
					Create account
				</Button>
			</div>
		</div>
	);
};

export default InputDetails;
