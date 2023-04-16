import HomeLayout from "@/components/Layout/HomeLayout";
import Dashboard from "@/components/Common/Dashboard";

const Home = () => {
	return (
		<HomeLayout title="Home" restrict={true}>
			<Dashboard />
		</HomeLayout>
	);
};

export default Home;
