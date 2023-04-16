import HomeLayout from "@/components/Layout/HomeLayout";
import UserCredentials from "@/components/Pages/Integration/UserCredentials";

const Integration = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<UserCredentials />
		</HomeLayout>
	);
};

export default Integration;
