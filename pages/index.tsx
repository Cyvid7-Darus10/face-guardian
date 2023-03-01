import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Badge from "@mui/material/Badge";

const Home = () => {
	return (
		<div className="text-3xl font-bold underline">
			<Badge badgeContent={4} color="primary">
				<RocketLaunchIcon />
			</Badge>
			Hello world!
		</div>
	);
};

export default Home;
