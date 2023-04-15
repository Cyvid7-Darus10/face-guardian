import { useEffect, useState, useRef } from "react";
import {
	loadModels,
	createMatcher,
	getFullFaceDescription,
	detectFace,
	isSmiling,
} from "@/utils/face";
import { faceData } from "./faceData";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as Crypto from "crypto-js";
import { toast } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
	const fpPromise = FingerprintJS.load();

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
					const userId = tempMatch[0]._label;
					loginUser(userId);
				} else {
					toast("User is not registered", {
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
		toast("Please wait for the camera to load", {
			type: "info",
			autoClose: 2000,
		});

		let smileCount = 0;
		let isSmilingPrevious = false;
		let isCameraReady = false;

		while (true) {
			if (webcamRef?.current) {
				if (!isCameraReady && webcamRef.current.video.readyState === 4) {
					isCameraReady = true;
					toast("Camera is ready, please smile", {
						type: "success",
						autoClose: 2000,
					});
				}

				const screenShot = webcamRef.current.getScreenshot();
				if (screenShot) {
					const result = await detectFace(screenShot);
					if (result.length > 1) {
						toast("Multiple faces detected", {
							type: "error",
							autoClose: 2000,
						});
					} else if (result.length === 1) {
						const fullDesc = await getFullFaceDescription(screenShot);
						const isUserSmiling =
							fullDesc && fullDesc[0] && isSmiling(fullDesc[0]);

						if (isUserSmiling && !isSmilingPrevious) {
							isSmilingPrevious = true;
							smileCount++;
							toast(`Smile detected! (${smileCount}/1)`, {
								type: "success",
								autoClose: 2000,
							});
						} else if (!isUserSmiling) {
							isSmilingPrevious = false;
						}

						if (smileCount === 1) {
							setImageURL(screenShot);
							handleImage(screenShot, fMatcher);
							break; // exit the loop if 3 smiles are detected
						}
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
		const fp = await fpPromise;
		const result = await fp.get();
		const deviceID = result.visitorId;

		if (devices.includes(deviceID)) {
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
