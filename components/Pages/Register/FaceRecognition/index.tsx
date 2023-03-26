import { useEffect, useState, ChangeEvent } from "react";
import {
	loadModels,
	createMatcher,
	getFullFaceDescription,
} from "@/utils/face";
import Image from "next/image";
import { data } from "./faceData";

// Import image to test API
const testImg = "/test/1X1.png";

// Import face profile
const JSON_PROFILE = data;

interface Detection {
	box: {
		height: number;
		width: number;
		_x: number;
		_y: number;
	};
}

interface Match {
	_label: string;
}

const FaceRecognition = () => {
	const [imageURL, setImageURL] = useState<string>(testImg);
	const [match, setMatch] = useState<Match[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [faceMatcher, setFaceMatcher] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			await loadModels();
			const faceMatcher = await createMatcher(JSON_PROFILE);
			setFaceMatcher(faceMatcher);
			handleImage(imageURL, faceMatcher);
		};
		fetchData();
		// eslint-disable-next-line
	}, []);

	const handleImage = async (
		image: string = imageURL,
		fMatch: any = faceMatcher
	) => {
		let temptDescriptors: any = [];
		await getFullFaceDescription(image).then((fullDesc) => {
			if (fullDesc) {
				temptDescriptors = fullDesc.map((fd: any) => fd.descriptor);
				// store the descriptors of the detected faces
				console.log(temptDescriptors);
			}
		});

		if (temptDescriptors.length > 0 && fMatch) {
			let tempMatch = await temptDescriptors.map((descriptor: any) =>
				fMatch.findBestMatch(descriptor)
			);
			console.log(tempMatch);
			setMatch(tempMatch);
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const image = URL.createObjectURL(event.target.files[0]);
			setImageURL(image);
			handleImage(image, faceMatcher);
		}
	};

	return (
		<div>
			<input
				id="myFileUpload"
				type="file"
				onChange={handleFileChange}
				accept=".jpg, .jpeg, .png"
			/>
			<div style={{ position: "relative" }}>
				<div style={{ position: "absolute" }}>
					<Image src={imageURL} alt="imageURL" width={500} height={500} />
				</div>
			</div>
		</div>
	);
};

export default FaceRecognition;
