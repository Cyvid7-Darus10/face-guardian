import ParticleLayout from "../../components/Layout/ParticleLayout";
import Image from "next/image";
import Link from "next/link";

const Intro = () => {
	return (
		<ParticleLayout title="Intro" restrict={true}>
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

				<div className="flex flex-row gap-2 text-white text-center z-50 w-full">
					<Link
						href="/"
						className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md">
						Back
					</Link>
					<Link
						href="/register"
						className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md">
						Next
					</Link>
				</div>
			</div>
		</ParticleLayout>
	);
};

export default Intro;
