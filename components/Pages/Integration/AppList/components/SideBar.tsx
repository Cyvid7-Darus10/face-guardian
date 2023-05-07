import Button from "@mui/material/Button";
import AppCreation from "@/components/Pages/Integration/AppCreation";

const Sidebar = ({
	appLists,
	setAppList,
	selectedApp,
	setSelectedApp,
}: {
	appLists: any;
	setAppList: any;
	selectedApp: any;
	setSelectedApp: any;
}) => {
	const handleSelectApp = (app: any) => {
		setSelectedApp(app);
	};

	return (
		<div className="flex flex-col items-start w-[200px] justify-start h-full gap-5">
			<AppCreation setAppList={setAppList} />
			<hr className="w-full" />
			{appLists.map((app: any) => (
				<Button
					key={app.id}
					onClick={() => handleSelectApp(app)}
					variant="contained"
					className={`hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full px-5 truncate ${
						selectedApp.id === app.id
							? "bg-[#ddf3ff] text-[#5f9cbf]"
							: "bg-[#accfe1] text-[#2c566f]"
					}`}>
					{app.name}
				</Button>
			))}
		</div>
	);
};

export default Sidebar;
