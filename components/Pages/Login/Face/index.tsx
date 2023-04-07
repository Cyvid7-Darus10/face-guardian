import Image from "next/image";
import Link from "next/link";
import FaceRecognition from "../FaceRecognition";

const Face = () => {
	return (
		<div className="flex flex-col items-center gap-10 w-full lg:w-[800px] p-5 lg:p-10 z-50 mx-auto">
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
			<FaceRecognition />
			<div className="flex w-full gap-2 text-center items-center justify-center z-50 2xl:text-lg">
				<Link
					href="/register"
					className="cursor-pointer text-[#5f9cbf] hover:underline">
					Register
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
