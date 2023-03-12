import { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import useToast from "../../../Atom/Toast";
import isEmail from "validator/lib/isEmail";
import { passwordStrength } from "check-password-strength";

const InputDetails = () => {
	const { openSnackbar, Snackbar } = useToast();

	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const onSubmit = () => {
		if (!isEmail(userData.email)) {
			openSnackbar("Please enter a valid email", "error");
			return;
		} else if (passwordStrength(userData.password).id < 2) {
			openSnackbar(
				"The password is too weak use a stronger password. Use at least 8 characters, a number, a lowercase and an uppercase letter",
				"error"
			);
			return;
		} else if (userData.firstName.length < 1) {
			openSnackbar("Please enter your first name", "error");
			return;
		} else if (userData.lastName.length < 1) {
			openSnackbar("Please enter your last name", "error");
			return;
		}

		openSnackbar("Account created successfully", "success");
	};

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
			<Image
				src="/fg-logo.png"
				alt="fg-logo"
				width={1000}
				height={1000}
				className="z-50 w-full lg:w-1/3"
			/>
			<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
				<InputFields userData={userData} setUserData={setUserData} />
				<Button
					onClick={onSubmit}
					variant="contained"
					color="primary"
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto">
					Create account
				</Button>
			</div>
			{Snackbar}
		</div>
	);
};

export default InputDetails;
