import { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import useToast from "../../../Atom/Toast";
import isEmail from "validator/lib/isEmail";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const InputDetails = () => {
	const supabaseClient = useSupabaseClient();
	const { openSnackbar, Snackbar } = useToast();

	const [userData, setUserData] = useState({
		email: "",
		password: "",
	});

	const onSubmit = async () => {
		if (!isEmail(userData.email)) {
			openSnackbar("Please enter a valid email", "error");
			return;
		} else if (!userData.password) {
			openSnackbar("Please input your password", "error");
			return;
		}

		const { error, data } = await supabaseClient.auth.signInWithPassword({
			email: userData.email,
			password: userData.password,
		});

		if (error) {
			openSnackbar(error.message, "error");
			return;
		} else if (data) {
			openSnackbar("Logged in successfully", "success");

			setTimeout(() => {
				window.location.href = "/home";
			}, 2000);
		} else {
			openSnackbar("Something went wrong", "error");
			return;
		}
	};

	return (
		<div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
			<Image
				src="/fg-logo.png"
				alt="fg-logo"
				width={500}
				height={500}
				className="z-50 w-full lg:w-1/3"
			/>
			<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
				<InputFields userData={userData} setUserData={setUserData} />
				<Button
					onClick={onSubmit}
					variant="contained"
					color="primary"
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto">
					Login
				</Button>
			</div>
			{Snackbar}
		</div>
	);
};

export default InputDetails;
