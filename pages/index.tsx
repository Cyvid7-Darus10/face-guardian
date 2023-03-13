import ParticleLayout from "../components/Layout/ParticleLayout";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
	return (
		<ParticleLayout title="Home" restrict={true}>
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
					<div className="flex flex-row gap-2 text-white text-center">
						<Link
							href="/register/intro"
							className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md">
							<RocketLaunchIcon />
							Get Started (Register)
						</Link>
						<Link
							href="/login"
							className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md">
							Login
						</Link>
					</div>
				</div>

				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={300}
					height={300}
					className="z-50 w-full lg:w-1/3"
				/>
			</div>
		</ParticleLayout>
	);
};

export default Home;
