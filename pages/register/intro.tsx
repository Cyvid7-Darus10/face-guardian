import ParticleLayout from "../../components/Layout/ParticleLayout";
import Image from "next/image";
import Button from "@mui/material/Button";

const Intro = () => {
	return (
		<ParticleLayout title="Intro">
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
				<div className="flex flex-col items-center justify-center gap-5 bg-[#ddf3ff] p-10 shadow">
					<p className="leading-[30px] text-[20px]">
						{`
						We're thrilled to have you join our community. To get started,
						please let our algorithm scan your face. This will make sure that
						you are a unique user before proceeding with the registration
						process. `}
					</p>
					<p className="leading-[30px] text-[20px]">
						{`
					Once you've completed the registration form, we'll send you
						a verification email to the email address you provided. Please click
						on the verification link in this email to confirm your account and
						complete the registration process.`}
					</p>
					<p className="leading-[30px] text-[20px]">
						{`
						After you've confirmed your
						account, you'll be able to access all of the features and
						functionality of Face Guardian.`}
					</p>
				</div>

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

export default Intro;
