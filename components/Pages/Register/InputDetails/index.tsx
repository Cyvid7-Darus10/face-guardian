import { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import isEmail from "validator/lib/isEmail";
import { passwordStrength } from "check-password-strength";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as Crypto from "crypto-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";

const InputDetails = ({ faceDescriptors }: { faceDescriptors: any }) => {
	const supabaseClient = useSupabaseClient();
	const fpPromise = FingerprintJS.load();

	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const onSubmit = async () => {
		if (!isEmail(userData.email)) {
			toast("Please enter a valid email", {
				type: "error",
				autoClose: 2000,
			});
			return;
		} else if (passwordStrength(userData.password).id < 2) {
			toast(
				`The password is ${passwordStrength(
					userData.password
				).value.toLowerCase()}, use a stronger password.`,
				{
					type: "error",
					autoClose: 2000,
				}
			);
			return;
		} else if (userData.firstName.length < 1) {
			toast("Please enter your first name", {
				type: "error",
				autoClose: 2000,
			});
			return;
		} else if (userData.lastName.length < 1) {
			toast("Please enter your last name", {
				type: "error",
				autoClose: 2000,
			});
			return;
		}

		const encryptedPassword = Crypto.AES.encrypt(
			userData.password,
			process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
		).toString();

		const { error, data } = await supabaseClient.auth.signUp({
			email: userData.email,
			password: userData.password,
			options: {
				emailRedirectTo: "https://www.face-guardian.com/home",
				data: {
					first_name: userData.firstName,
					last_name: userData.lastName,
					password: encryptedPassword,
				},
			},
		});

		if (error) {
			toast(error.message, {
				type: "error",
				autoClose: 2000,
			});
			return;
		} else if (data) {
			const { error } = await supabaseClient.from("face_descriptors").insert([
				{
					profile_id: data?.user?.id,
					descriptors: "{" + faceDescriptors[0].toString() + "}",
				},
			]);

			if (error) {
				toast(error.message, {
					type: "error",
					autoClose: 2000,
				});
				return;
			}

			const fp = await fpPromise;
			const result = await fp.get();
			const deviceID = result.visitorId;

			const { error: errror2 } = await supabaseClient
				.from("profile_devices")
				.insert([
					{
						profile_id: data?.user?.id,
						device_id: deviceID,
						user_agent: navigator.userAgent,
					},
				]);

			if (errror2) {
				toast(errror2.message, {
					type: "error",
					autoClose: 2000,
				});
				return;
			}

			toast(
				"Account created successfully. Please check your email for verification.",
				{
					type: "success",
					autoClose: 2000,
				}
			);

			setTimeout(() => {
				window.location.href = "/";
			}, 3000);
		} else {
			toast("Something went wrong", {
				type: "error",
				autoClose: 2000,
			});
			return;
		}
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
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full ">
					Create account
				</Button>
			</div>
		</div>
	);
};

export default InputDetails;
