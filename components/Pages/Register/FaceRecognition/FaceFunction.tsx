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
import { toast } from "react-toastify";

interface Match {
	_label: string;
}

const videoConstraints = {
	width: 720,
	height: 720,
	facingMode: "user",
};

const FaceFunction = ({ setFaceDescriptors }: { setFaceDescriptors: any }) => {
	const webcamRef = useRef<any>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [faceMatcher, setFaceMatcher] = useState<any>(null);
	const supabaseClient = useSupabaseClient();

	useEffect(() => {
		const fetchData = async () => {
			toast("Algorithm initializing...", {
				type: "info",
				autoClose: 2000,
			});
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
					toast("User is registered already", {
						type: "error",
						autoClose: 2000,
					});
				} else {
					toast("User is not registered", {
						type: "error",
						autoClose: 2000,
					});
					setTimeout(() => {
						setFaceDescriptors(temptDescriptors);
					}, 1000);
				}
			} else {
				toast("Something went wrong", {
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
					toast("Camera is ready, please smile 3 times", {
						type: "success",
						autoClose: 5000,
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
							toast(`Smile detected! (${smileCount}/3)`, {
								type: "success",
								autoClose: 2000,
							});
						} else if (!isUserSmiling) {
							isSmilingPrevious = false;
						}

						if (smileCount === 3) {
							setImageURL(screenShot);
							toast("3 smiles detected, capturing image", {
								type: "success",
								autoClose: 2000,
							});
							handleImage(screenShot, fMatcher);
							break; // exit the loop if 3 smiles are detected
						}
					}
				}
			}
			await new Promise((resolve) => setTimeout(resolve, 100)); // wait for 100ms before trying again
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
