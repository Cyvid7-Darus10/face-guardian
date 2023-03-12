import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarState {
	open: boolean;
	message?: string;
	severity?: Severity;
}

interface useToastReturn {
	openSnackbar: (message: string, severity?: Severity) => void;
	Snackbar: JSX.Element;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useToast = (): useToastReturn => {
	const [snackbar, setSnackbar] = React.useState<SnackbarState>({
		open: false,
	});

	const openSnackbar = (message: string, severity?: Severity) => {
		setSnackbar({ open: true, message, severity });
	};

	const handleClose = (event?: React.SyntheticEvent) => {
		if (event && event.type === "clickaway") {
			return;
		}

		setSnackbar({ ...snackbar, open: false });
	};

	return {
		openSnackbar,
		Snackbar: (
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleClose}>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		),
	};
};

export default useToast;
