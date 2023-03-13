import Button from "@mui/material/Button";
import Table from "../../Atom/Table";

const Dashboard = () => {
	return (
		<div className="flex flex-row items-center w-full h-full lg:p-10 z-50 gap-5">
			<div className="flex flex-col w-[200px] justify-between items-between h-full">
				<Button
					href="/register"
					variant="contained"
					color="info"
					className=" hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full">
					Websites
				</Button>
				<Button
					href="/register"
					variant="contained"
					color="primary"
					className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full">
					Logout
				</Button>
			</div>
			<div className="w-full bg-[#ddf3ff] h-full p-10">
				<Table />
			</div>
		</div>
	);
};

export default Dashboard;
