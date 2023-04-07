import { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import isEmail from "validator/lib/isEmail";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";

const InputDetails = () => {
	const supabaseClient = useSupabaseClient();
	const fpPromise = FingerprintJS.load();

	const [userData, setUserData] = useState({
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
		} else if (!userData.password) {
			toast("Please enter a password", {
				type: "error",
				autoClose: 2000,
			});
			return;
		}

		const { error, data } = await supabaseClient.auth.signInWithPassword({
			email: userData.email,
			password: userData.password,
		});

		if (error) {
			toast(error.message, {
				type: "error",
				autoClose: 2000,
			});
			return;
		} else if (data) {
			toast("Login Successful", {
				type: "success",
				autoClose: 2000,
			});

			const fp = await fpPromise;
			const result = await fp.get();
			const deviceID = result.visitorId;

			insertDeviceID(data?.user?.id as string, deviceID);

			setTimeout(() => {
				window.location.href = "/home";
			}, 2000);
		} else {
			toast("Login Failed", {
				type: "error",
				autoClose: 2000,
			});
			return;
		}
	};

	const insertDeviceID = async (userID: string, deviceID: string) => {
		const { data } = await supabaseClient
			.from("profile_devices")
			.select("*")
			.eq("profile_id", userID)
			.eq("device_id", deviceID);

		if (data?.length) {
			return;
		}

		const { error } = await supabaseClient.from("profile_devices").insert([
			{
				profile_id: userID,
				device_id: deviceID,
				user_agent: navigator.userAgent,
			},
		]);

		if (error) {
			toast(error.message, {
				type: "error",
				autoClose: 2000,
			});
			return;
		} else {
			toast("Device ID inserted", {
				type: "success",
				autoClose: 2000,
			});
		}
	};

	return (
		<div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
			<Image
				src="/fg-logo.png"
				alt="fg-logo"
				width={300}
				height={300}
				className="z-50 w-full lg:w-1/3"
			/>
			<div className="flex flex-col items-center gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
				<InputFields userData={userData} setUserData={setUserData} />
				<Button
					onClick={onSubmit}
					variant="contained"
					color="primary"
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto">
					Login
				</Button>
			</div>
		</div>
	);
};

export default InputDetails;
