import Image from "next/image";
import Webcam from "react-webcam";
import FaceFunction from "./FaceFunction";

const FaceRecognition = ({
	setFaceDescriptors,
}: {
	setFaceDescriptors: any;
}) => {
	const {
		webcamRef,
		imageURL,
		capture,
		videoConstraints,
		ReplayIcon,
		faceMatcher,
		setImageURL,
	} = FaceFunction({ setFaceDescriptors });

	return (
		<div className="flex flex-col items-center justify-center gap-5 w-[400px] h-[400px] bg-[#ddf3ff] p-2 shadow z-50">
			{!imageURL && (
				<>
					<Webcam
						audio={false}
						height={720}
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						width={720}
						videoConstraints={videoConstraints}
						mirrored={true}
					/>
					<Image
						src="/face-guide.png"
						width={1000}
						height={1000}
						alt="face-guide"
						className="z-50 w-[300px] h-[300px] absolute opacity-60"
					/>
				</>
			)}
			{imageURL && (
				<>
					<Image
						src={imageURL}
						width={1000}
						height={1000}
						alt="face-guide"
						className="z-50 w-[400px] h-[400px] absolute border-4 border-[#5f9cbf] rounded-md"
					/>
					<button
						onClick={() => {
							setImageURL(null);
							capture(faceMatcher);
						}}
						className="bg-[#5f9cbf] text-white rounded-full hover:bg-[#ddf3ff] hover:text-[#5f9cbf] m-auto z-50 p-4 border">
						<ReplayIcon />
					</button>
				</>
			)}
		</div>
	);
};

export default FaceRecognition;
