import { useEffect, useState, useRef } from "react";
import {
	loadModels,
	createMatcher,
	getFullFaceDescription,
	detectFace,
} from "@/utils/face";
import { faceData } from "./faceData";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as Crypto from "crypto-js";
import useDeviceID from "@/store/useDeviceID";
import { toast } from "react-toastify";

const videoConstraints = {
	width: 720,
	height: 720,
	facingMode: "user",
};

const FaceFunction = () => {
	const webcamRef = useRef<any>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [faceMatcher, setFaceMatcher] = useState<any>(null);
	const supabaseClient = useSupabaseClient();
	const { deviceID } = useDeviceID();

	useEffect(() => {
		const fetchData = async () => {
			await loadModels();
			const data = await faceData(supabaseClient);
			const faceMatcher = await createMatcher(data);
			setFaceMatcher(faceMatcher);
			await capture(faceMatcher);
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleImage = async (
		image: string | null = imageURL,
		fMatch: any = faceMatcher
	) => {
		if (image) {
			let temptDescriptors: any = [];
			await getFullFaceDescription(image).then((fullDesc) => {
				if (fullDesc) {
					temptDescriptors = fullDesc.map((fd: any) => fd.descriptor);
				}
			});

			if (temptDescriptors.length > 0 && fMatch) {
				let tempMatch = await temptDescriptors.map((descriptor: any) =>
					fMatch.findBestMatch(descriptor)
				);
				if (tempMatch[0]._label !== "unknown") {
					toast("Login Successful", {
						type: "success",
						autoClose: 2000,
					});
					const userId = tempMatch[0]._label;
					loginUser(userId);
				} else {
					toast("Login Failed", {
						type: "error",
						autoClose: 2000,
					});
				}
			} else {
				toast("Login Failed", {
					type: "error",
					autoClose: 2000,
				});
			}
		}
	};

	const capture = async (fMatcher: any) => {
		toast("Please wait while we detect your face", {
			type: "info",
			autoClose: 2000,
		});

		while (true) {
			if (webcamRef?.current) {
				const screenShot = webcamRef.current.getScreenshot();
				if (screenShot) {
					const result = await detectFace(screenShot);
					if (result.length > 1) {
						toast("Multiple faces detected", {
							type: "error",
							autoClose: 2000,
						});
					} else if (result.length === 1) {
						setImageURL(screenShot);
						toast("Face detected", {
							type: "success",
							autoClose: 2000,
						});
						handleImage(screenShot, fMatcher);
						break; // exit the loop if a face is detected
					}
				}
			}
			await new Promise((resolve) => setTimeout(resolve, 100)); // wait for 100ms before trying again
		}
	};

	const loginUser = async (userId: string) => {
		const { data, error } = await supabaseClient
			.from("profiles")
			.select("*, profile_devices(device_id)")
			.eq("id", userId)
			.single();

		if (error) {
			console.error(error);
			return;
		}

		const devices = data?.profile_devices.map(
			(device: any) => device.device_id
		);

		if (data && (await isCurrentDevicePresent(devices))) {
			const decipheredPassword = Crypto.AES.decrypt(
				data.password,
				process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
			).toString(Crypto.enc.Utf8);

			const { error } = await supabaseClient.auth.signInWithPassword({
				email: data.email,
				password: decipheredPassword,
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
		}
	};

	const isCurrentDevicePresent = async (devices: any): Promise<boolean> => {
		console.log("Device ID: ", deviceID);
		console.log("devices: ", devices);
		if (devices.includes(deviceID)) {
			console.log("Device is registered");
			return true;
		} else {
			toast("Device is not registered", {
				type: "error",
				autoClose: 2000,
			});
			return false;
		}
	};

	return {
		webcamRef,
		imageURL,
		capture,
		videoConstraints,
		ReplayIcon,
		faceMatcher,
		setImageURL,
	};
};

export default FaceFunction;
