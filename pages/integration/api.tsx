import HomeLayout from "@/components/Layout/HomeLayout";
import UserCredentials from "@/components/Pages/Integration/UserCredentials";
import IntegrationLayout from "@/components/Layout/IntegrationLayout";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<IntegrationLayout pageTitle="API">
				<UserCredentials />
			</IntegrationLayout>
		</HomeLayout>
	);
};

export default Integration;
