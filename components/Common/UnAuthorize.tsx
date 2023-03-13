import Image from "next/image";
import Button from "@mui/material/Button";

const UnAuthorize = () => {
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
