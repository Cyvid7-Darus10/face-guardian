import { useState } from "react";
import useUserDataStore from "@/store/userDataStore";
import HiddenInput from "./components/HiddentInput";

const Dashboard = () => {
	const { userData } = useUserDataStore();

	return (
		<div className="flex flex-row items-center w-full h-full lg:p-10 z-50 gap-5 max-w-[1440px] mx-auto">
			<div className="flex flex-col w-full h-full gap-5">
				<div className="flex flex-col">
					<p className="w-fit">Client ID:</p>
					<HiddenInput content={userData?.id} />
				</div>
				<div className="flex flex-col">
					<p className="w-fit">Secrent Key:</p>
					<HiddenInput content={userData?.clients?.secret_key} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
