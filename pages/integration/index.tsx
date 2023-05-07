import HomeLayout from "@/components/Layout/HomeLayout";
import UserCredentials from "@/components/Pages/Integration/UserCredentials";
import UserGuide from "@/components/Pages/Integration/UserGuide";
import AppCreation from "@/components/Pages/Integration/AppCreation";
import AppList from "@/components/Pages/Integration/AppList";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<div className="max-w-[1440px] mx-auto p-5 lg:p-10">
				<UserCredentials />
				<AppList />
				<UserGuide />
			</div>
		</HomeLayout>
	);
};

export default Integration;
