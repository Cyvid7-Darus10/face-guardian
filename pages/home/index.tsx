import HomeLayout from "@/components/Layout/HomeLayout";
import Dashboard from "@/components/Common/Dashboard";
import useUserDataStore from "@/store/userDataStore";
import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const Home = () => {
	const { setUserData } = useUserDataStore();
	const supabaseClient = useSupabaseClient();
	const session = useSession();

	useEffect(() => {
		const getUserData = async () => {
			const { data, error } = await supabaseClient
				.from("profiles")
				.select("*")
				.eq("id", session?.user?.id as string)
				.single();

			if (error) {
				console.error(error);
				return;
			} else if (data) {
				setUserData(data);
			}
		};

		getUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	return (
		<HomeLayout title="Home" restrict={true}>
			<Dashboard />
		</HomeLayout>
	);
};

export default Home;
