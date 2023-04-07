import Image from "next/image";
import FaceRecognition from "../FaceRecognition";
import Link from "next/link";

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
			<div className="flex w-full gap-2 text-center items-center justify-center z-50 2xl:text-lg">
				<Link
					href="/"
					className="cursor-pointer text-[#5f9cbf] hover:underline">
					Home
				</Link>
				|
				<Link
					href="/login/email"
					className="cursor-pointer text-[#5f9cbf] hover:underline">
					Login using email?
				</Link>
			</div>
		</div>
	);
};

export default Face;
