import Image from "next/image";
import FaceRecognition from "../FaceRecognition";

const Face = ({
	setFaceDescriptors,
}: {
	setFaceDescriptors: (arg: boolean) => void;
}) => {
	return (
		<div className="flex flex-col items-center gap-10 w-full lg:w-1/2 p-5 lg:p-10 z-50 mx-auto">
			<div className="flex flex-col items-center">
				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={300}
					height={300}
					className="z-50 lg:w-[100px]"
				/>
				<p className="text-[35px] font-extrabold w-full text-center lg:text-left">
					Face Guardian
				</p>
			</div>
			<FaceRecognition setFaceDescriptors={setFaceDescriptors} />
		</div>
	);
};

export default Face;
