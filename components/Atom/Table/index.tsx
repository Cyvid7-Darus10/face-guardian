import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import Modal from "../Modal";

function createData(
	name: string,
	dateCreated: string,
	lastAccessed: string,
	url: string
) {
	return { name, dateCreated, lastAccessed, url };
}

const rows = [
	createData("Facebook", "Jan 1, 2021", "Jan 1, 2021", "www.facebook.com"),
	createData("Twitter", "Jan 1, 2021", "Jan 1, 2021", "www.twitter.com"),
	createData("Instagram", "Jan 1, 2021", "Jan 1, 2021", "www.instagram.com"),
	createData("LinkedIn", "Jan 1, 2021", "Jan 1, 2021", "www.linkedin.com"),
	createData("Github", "Jan 1, 2021", "Jan 1, 2021", "www.github.com"),
];

export default function BasicTable() {
	const [open, setOpen] = useState(false);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }}>
				<TableHead>
					<TableRow className="bg-[#ddf3ff] ">
						<TableCell align="center">Website</TableCell>
						<TableCell align="center">Date Created</TableCell>
						<TableCell align="center">Last Accessed</TableCell>
						<TableCell align="center">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row" align="center">
								<Link
									href={row.url}
									target="_blank"
									rel="noreferrer"
									className="text-[#5f9cbf]">
									{row.name}
								</Link>
							</TableCell>
							<TableCell align="center">{row.dateCreated}</TableCell>
							<TableCell align="center">{row.lastAccessed}</TableCell>
							<TableCell align="center">
								<button
									onClick={() => {
										setOpen(true);
									}}
									className="bg-red-400 text-white px-2 py-1 rounded-md">
									Delete
								</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Modal open={open} setOpen={setOpen} />
		</TableContainer>
	);
}
