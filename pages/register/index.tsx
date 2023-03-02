import ParticleLayout from "../../components/Layout/ParticleLayout";
import Image from "next/image";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Email from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Home = () => {
	return (
		<ParticleLayout title="Home">
			<div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 p-4 lg:p-20 z-50 w-full h-full">
				<Image
					src="/fg-logo.png"
					alt="fg-logo"
					width={1000}
					height={1000}
					className="z-50 w-full lg:w-1/3"
				/>
				<div className="flex flex-col gap-5 w-full lg:w-1/2 p-5 lg:p-10 z-50">
					<div className="flex flex-col gap-5">
						<div className="flex flex-row items-center gap-2 justify-center">
							<AccountCircle />
							<TextField
								id="input-with-sx"
								className="w-full"
								label="First Name"
								variant="standard"
								type="email"
							/>
						</div>
						<div className="flex flex-row items-center gap-2 justify-center">
							<AccountCircle />
							<TextField
								id="input-with-sx"
								className="w-full"
								label="Last Name"
								variant="standard"
								type="email"
							/>
						</div>
						<div className="flex flex-row items-center gap-2 justify-center">
							<Email />
							<TextField
								id="input-with-sx"
								className="w-full"
								label="Email"
								variant="standard"
								type="email"
							/>
						</div>
						<div className="flex flex-row items-center gap-2 justify-center">
							<LockIcon />
							<TextField
								id="input-with-sx"
								className="w-full"
								label="Password"
								variant="standard"
								type="password"
							/>
						</div>
					</div>
					<Button
						href="/register/intro"
						variant="contained"
						color="primary"
						className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto">
						Create account
					</Button>
				</div>
			</div>
		</ParticleLayout>
	);
};

export default Home;
