import HomeLayout from "@/components/Layout/HomeLayout";
import UserGuide from "@/components/Pages/Integration/UserGuide";
import IntegrationLayout from "@/components/Layout/IntegrationLayout";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<IntegrationLayout pageTitle="Guide">
				<UserGuide />
			</IntegrationLayout>
		</HomeLayout>
	);
};

export default Integration;
