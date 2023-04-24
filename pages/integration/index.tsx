import HomeLayout from "@/components/Layout/HomeLayout";
import UserCredentials from "@/components/Pages/Integration/UserCredentials";
import UserGuide from "@/components/Pages/Integration/UserGuide";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<div className="max-w-[1440px] mx-auto lg:p-10">
				<UserCredentials />
				<UserGuide />
			</div>
		</HomeLayout>
	);
};

export default Integration;
