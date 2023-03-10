import HomeLayout from "../../components/Layout/HomeLayout";
import Dashboard from "../../components/Common/Dashboard";

const Register = () => {
	return (
		<HomeLayout title="Login" restrict={true}>
			<Dashboard />
		</HomeLayout>
	);
};

export default Register;
