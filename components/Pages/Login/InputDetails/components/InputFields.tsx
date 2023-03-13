import { useState } from "react";
import Email from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";

const InputFields = ({
	userData,
	setUserData,
}: {
	userData: {
		email: string;
		password: string;
	};
	setUserData: (string) => void;
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-row items-center gap-2 justify-center text-dark">
				<Email />
				<Input
					className="w-full"
					type="email"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setUserData({ ...userData, email: event.target.value });
					}}
					placeholder="Email"
				/>
			</div>
			<div className="flex flex-row items-center gap-2 justify-center text-black">
				<LockIcon />
				<Input
					className="w-full"
					type={showPassword ? "text" : "password"}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setUserData({ ...userData, password: event.target.value });
					}}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
								edge="end">
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
					placeholder="Password"
				/>
			</div>
		</div>
	);
};

export default InputFields;
