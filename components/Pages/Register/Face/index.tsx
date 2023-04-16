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
			<Link className="flex flex-col items-center" href="/">
				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={300}
					height={300}
					className="z-50 w-[75px] fixed bottom-5 lg:top-5 lg:left-5"
				/>
			</Link>
			<FaceRecognition setFaceDescriptors={setFaceDescriptors} />
			<div className="flex w-full gap-2 text-center items-center justify-center z-50 2xl:text-lg">
				<Link
					href="/login"
					className="cursor-pointer text-[#5f9cbf] hover:underline">
					Login using face?
				</Link>
				|
				<Link
					href="/login"
					className="cursor-pointer text-[#5f9cbf] hover:underline">
					Login using email?
				</Link>
			</div>
		</div>
	);
};

export default Face;
