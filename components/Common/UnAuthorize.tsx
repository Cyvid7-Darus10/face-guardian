import Image from "next/image";
import Button from "@mui/material/Button";
import Link from "next/link";

const UnAuthorize = () => {
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
			<div className="flex flex-col items-center justify-center gap-5 bg-[#ddf3ff] p-10 shadow">
				Unauthorized Access
			</div>

			<Button
				href="/register"
				variant="contained"
				color="primary"
				className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] m-auto">
				GO BACK
			</Button>
		</div>
	);
};

export default UnAuthorize;
