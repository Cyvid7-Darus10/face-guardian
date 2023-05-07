import HomeLayout from "@/components/Layout/HomeLayout";
import UserCredentials from "@/components/Pages/Integration/UserCredentials";
import UserGuide from "@/components/Pages/Integration/UserGuide";
import AppCreation from "@/components/Pages/Integration/AppCreation";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<div className="max-w-[1440px] mx-auto p-5 lg:p-10">
				<div className="flex flex-col-reverse lg:flex-row items-center w-full gap-5 mt-10">
					<UserCredentials />
					<AppCreation />
				</div>
				<UserGuide />
			</div>
		</HomeLayout>
	);
};

export default Integration;
