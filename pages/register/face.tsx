import ParticleLayout from "../../components/Layout/ParticleLayout";
import Image from "next/image";
import Button from "@mui/material/Button";

const Face = () => {
	return (
		<ParticleLayout title="Face">
			<div className="flex flex-col items-center gap-10 w-full lg:w-1/2 p-5 lg:p-10 z-50 mx-auto">
				<div className="flex flex-col items-center">
					<Image
						src="/fg-logo.png"
						alt="fg-logo"
						width={1000}
						height={1000}
						className="z-50 lg:w-[100px]"
					/>
					<p className="text-[35px] font-extrabold w-full text-center lg:text-left">
						Face Guardian
					</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-5 bg-[#ddf3ff] p-10 shadow h-[400px] w-[500px]"></div>

				<Button
					href="/register"
					variant="contained"
					color="primary"
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto">
					Next
				</Button>
			</div>
		</ParticleLayout>
	);
};

export default Face;
