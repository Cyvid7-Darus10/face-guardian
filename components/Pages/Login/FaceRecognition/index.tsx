import Image from "next/image";
import Webcam from "react-webcam";
import FaceFunction from "./FaceFunction";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const FaceRecognition = () => {
	const {
		webcamRef,
		imageURL,
		capture,
		videoConstraints,
		ReplayIcon,
		faceMatcher,
		setImageURL,
		captchaToken,
		setCaptchaToken,
	} = FaceFunction();

	return (
		<div className="flex flex-col items-center justify-center gap-5 w-[400px] h-[400px] bg-[#ddf3ff] p-2 shadow z-50">
			{!imageURL && captchaToken && (
				<>
					<Webcam
						audio={false}
						height={480}
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						width={480}
						videoConstraints={videoConstraints}
						mirrored={true}
					/>
					<Image
						src="/face-guide.png"
						width={480}
						height={480}
						alt="face-guide"
						className="z-50 w-[300px] h-[300px] absolute opacity-60"
					/>
				</>
			)}
			{imageURL && captchaToken && (
				<>
					<Image
						src={imageURL}
						width={480}
						height={480}
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
			{!captchaToken && (
				<HCaptcha
					sitekey="10000000-ffff-ffff-ffff-000000000001"
					onVerify={setCaptchaToken}
				/>
			)}
		</div>
	);
};

export default FaceRecognition;
