import { useState, useRef } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import InputFields from "./components/InputFields";
import isEmail from "validator/lib/isEmail";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";

const InputDetails = () => {
	const supabaseClient = useSupabaseClient();
	const fpPromise = FingerprintJS.load();
	const captchaRef = useRef<any>(null);
	const siteKey =
		process.env.NODE_ENV === "production"
			? "2cab0044-4c12-4815-ab94-7f4ed9f3c8d4"
			: "10000000-ffff-ffff-ffff-000000000001";

	const [userData, setUserData] = useState({
		email: "",
		password: "",
		captchaToken: "",
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
			options: {
				captchaToken: userData.captchaToken,
			},
		});

		if (error) {
			toast(error.message, {
				type: "error",
				autoClose: 2000,
			});
		} else if (data) {
			toast("Login Successful", {
				type: "success",
				autoClose: 2000,
			});

			await insertDeviceID(data?.user?.id as string);

			setTimeout(() => {
				window.location.href = "/home";
			}, 2000);
		} else {
			toast("Login Failed", {
				type: "error",
				autoClose: 2000,
			});
		}

		setUserData({
			...userData,
			captchaToken: "",
		});
		captchaRef?.current?.resetCaptcha();
	};

	const insertDeviceID = async (userID: string) => {
		const fp = await fpPromise;
		const result = await fp.get();
		const deviceID = result.visitorId;

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
				className="z-50 max-w-[250px] lg:w-1/3 lg:max-w-full"
			/>
			<div className="flex flex-col items-center gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
				<InputFields userData={userData} setUserData={setUserData} />
				<HCaptcha
					ref={captchaRef}
					sitekey={siteKey}
					onVerify={(token) =>
						setUserData({ ...userData, captchaToken: token })
					}
				/>
				<div className="flex w-full gap-2 text-center items-center justify-center z-50 2xl:text-lg">
					<Link
						href="/register"
						className="cursor-pointer text-[#5f9cbf] hover:underline">
						Register
					</Link>
					|
					<Link
						href="/login"
						className="cursor-pointer text-[#5f9cbf] hover:underline">
						Login using face?
					</Link>
				</div>
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
