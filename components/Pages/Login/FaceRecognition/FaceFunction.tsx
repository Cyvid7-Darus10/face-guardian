import { useEffect, useState, useRef } from "react";
import {
	loadModels,
	createMatcher,
	getFullFaceDescription,
	detectFace,
} from "@/utils/face";
import { faceData } from "./faceData";
import useToast from "@/components/Atom/Toast";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as Crypto from "crypto-js";

const videoConstraints = {
	width: 720,
	height: 720,
	facingMode: "user",
};

const FaceFunction = () => {
	const { openSnackbar, Snackbar } = useToast();
	const webcamRef = useRef<any>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [faceMatcher, setFaceMatcher] = useState<any>(null);
	const supabaseClient = useSupabaseClient();

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
					openSnackbar("User is registered", "success");
					const userId = tempMatch[0]._label;

					loginUser(userId);
				} else {
					openSnackbar("User is not yet registered", "error");
				}
			}
		}
	};

	const capture = async (fMatcher: any) => {
		openSnackbar("Position your face properly", "info");
		while (true) {
			if (webcamRef?.current) {
				const screenShot = webcamRef.current.getScreenshot();
				if (screenShot) {
					const result = await detectFace(screenShot);
					if (result.length > 1) {
						openSnackbar("Multiple face detected", "error");
					} else if (result.length === 1) {
						setImageURL(screenShot);
						handleImage(screenShot, fMatcher);
						openSnackbar("Face Detected", "success");
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
			.select("*")
			.eq("id", userId)
			.single();

		if (error) {
			console.error(error);
			return;
		}

		if (data) {
			const decipheredPassword = Crypto.AES.decrypt(
				data.password,
				process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
			).toString(Crypto.enc.Utf8);

			const { error } = await supabaseClient.auth.signInWithPassword({
				email: data.email,
				password: decipheredPassword,
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
		}
	};

	return {
		webcamRef,
		imageURL,
		capture,
		videoConstraints,
		ReplayIcon,
		Snackbar,
		faceMatcher,
		setImageURL,
	};
};

export default FaceFunction;
