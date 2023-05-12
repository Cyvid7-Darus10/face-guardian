import { useState, useEffect } from "react";
import Sidebar from "./components/SideBar";
import AppDetails from "./components/AppDetails";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useUserDataStore from "@/store/userDataStore";
import { toast } from "react-toastify";

const AppList = () => {
	const supabaseClient = useSupabaseClient();
	const { userData } = useUserDataStore();
	const [appList, setAppList] = useState<any>(null);
	const [selectedApp, setSelectedApp] = useState<any>(null);

	useEffect(() => {
		const fetchApps = async () => {
			const { data, error } = await supabaseClient
				.from("apps")
				.select("*")
				.eq("client_id", userData?.id);

			if (error) {
				toast.error("Error fetching apps");
				console.error(error);
				return;
			} else {
				setAppList(data);
				setSelectedApp(data[0]);
			}
		};
		if (userData && userData.id) fetchApps();
	}, [supabaseClient, userData]);

	return (
		<div className="flex flex-row items-start w-full gap-5">
			{appList && (
				<Sidebar
					appLists={appList}
					setAppList={setAppList}
					selectedApp={selectedApp}
					setSelectedApp={setSelectedApp}
				/>
			)}
			{appList && selectedApp && (
				<AppDetails
					selectedApp={selectedApp}
					appList={appList}
					setAppList={setAppList}
					setSelectedApp={setSelectedApp}
				/>
			)}
		</div>
	);
};

export default AppList;
