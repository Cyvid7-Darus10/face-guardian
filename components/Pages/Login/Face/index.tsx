import Image from "next/image";
import Link from "next/link";
import FaceRecognition from "../FaceRecognition";

const Face = ({ appData }: { appData?: any }) => {
	return (
		<div className="flex flex-col items-center gap-10 w-full lg:w-[800px] p-5 lg:p-10 z-50 mx-auto">
			<Link className="flex flex-col items-center" href="/">
				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={300}
					height={300}
					className="z-50 w-[75px] fixed bottom-5 lg:top-5 lg:left-5"
				/>
			</Link>
			{appData && (
				<div className="flex flex-col items-center justify-center gap-5 p-2 shadow z-50">
					<p className="text-center text-dark text-xl">
						Logging to {appData.name}
					</p>
					<Link
						href={appData.domain}
						className="text-center text-[#5f9cbf] text-sm">
						{appData.domain}
					</Link>
				</div>
			)}
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
