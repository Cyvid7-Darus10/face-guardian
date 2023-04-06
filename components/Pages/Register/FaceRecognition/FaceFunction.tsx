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

interface Match {
	_label: string;
}

const videoConstraints = {
	width: 720,
	height: 720,
	facingMode: "user",
};

const FaceFunction = ({ setFaceDescriptors }: { setFaceDescriptors: any }) => {
	const { openSnackbar, Snackbar } = useToast();
	const webcamRef = useRef<any>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const [match, setMatch] = useState<Match[] | null>(null);
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
					openSnackbar("User is already registered", "error");
				} else {
					openSnackbar("User is not yet registered", "success");
					setTimeout(() => {
						setFaceDescriptors(temptDescriptors);
					}, 1000);
				}
				setMatch(tempMatch);
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
