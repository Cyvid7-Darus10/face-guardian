import ParticleLayout from "../components/Layout/ParticleLayout";
import Image from "next/image";
import Button from "@mui/material/Button";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const Home = () => {
	return (
		<ParticleLayout title="Home">
			<div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
				<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
					<p className="text-[35px] font-extrabold w-full text-center lg:text-left">
						Welcome to Face Guardian!
					</p>
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
					<Button
						variant="contained"
						color="primary"
						className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf]">
						<RocketLaunchIcon />
						Get Started
					</Button>
				</div>

				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={400}
					height={400}
					className="z-50"
				/>
			</div>
		</ParticleLayout>
	);
};

export default Home;
