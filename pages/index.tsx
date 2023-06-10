import ParticleLayout from "../components/Layout/ParticleLayout";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Link from "next/link";
import Image from "next/image";
import BasicModal from "@/components/Atom/BasicModal";

const Home = () => {
	return (
		<ParticleLayout title="Home" restrict={true}>
			<div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
				<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
					<h1 className="text-[35px] font-extrabold w-full text-center lg:text-left">
						Welcome to Face Guardian!
					</h1>
					<h2 className="text-[20px] w-full text-center lg:text-left">
						Revolutionizing Online Authentication for a Safer and More
						Convenient User Experience
					</h2>
					<BasicModal title="About">
						<h3 className="leading-[25px]">
							A novel authentication approach that combines cutting-edge facial
							recognition technology with the OAuth 2.0 protocol. This
							innovative solution addresses the prevalent issue of fake accounts
							and strengthens online security, while offering a seamless user
							experience. By enabling third-party accessibility, our system is
							easy to integrate across various platforms and services, providing
							a more secure and efficient alternative to traditional
							authentication methods.
						</h3>
					</BasicModal>
					<BasicModal title="Features">
						<div className="flex flex-col gap-2">
							<li>
								Facial recognition using the Histogram of Oriented Gradients
								(HOG) algorithm and dlib library
							</li>
							<li>
								OAuth 2.0 integration for compatibility with third-party
								platforms
							</li>
							<li>
								Secure token-based user authentication and device fingerprinting
							</li>
							<li>
								Real-time facial recognition for enhanced security and
								authentication
							</li>
							<li>
								Open-source codebase for easy integration and customization
							</li>
						</div>
					</BasicModal>
					<BasicModal title="Call to Action">
						<div className="flex flex-col gap-2">
							<li>
								Learn more about our research: Discover the problem we&apos;re
								addressing, our proposed solution, and the methodology behind
								our approach.
							</li>
							<li>
								Explore our results and evaluation: Gain insights into the
								usability testing, security assessment, performance evaluation,
								and OAuth protocol compatibility testing of our system.
							</li>
							<li>
								Download the full research paper: Access our complete study for
								an in-depth understanding of our novel authentication system.
							</li>
							<li>
								Contact us: Get in touch with our team to share your thoughts,
								ask questions, or collaborate on future projects.
							</li>
						</div>
					</BasicModal>
					<div className="flex flex-row gap-2 text-white text-center">
						<Link
							href="/register"
							className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md">
							<RocketLaunchIcon />
							Register
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
					width={150}
					height={150}
					className="z-50 max-w-[250px] lg:w-1/3 lg:max-w-full"
				/>
			</div>
		</ParticleLayout>
	);
};

export default Home;
