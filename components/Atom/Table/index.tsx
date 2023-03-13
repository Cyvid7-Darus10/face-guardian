import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "next/link";

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
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }}>
				<TableHead>
					<TableRow className="bg-gray-100">
						<TableCell align="center">Website</TableCell>
						<TableCell align="center">Date Created</TableCell>
						<TableCell align="center">Last Accessed</TableCell>
						<TableCell align="center">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								<Link
									href={row.url}
									target="_blank"
									rel="noreferrer"
									className="text-[#5f9cbf]">
									{row.name}
								</Link>
							</TableCell>
							<TableCell>{row.dateCreated}</TableCell>
							<TableCell>{row.lastAccessed}</TableCell>
							<TableCell align="center">
								<Button
									href="/register"
									variant="contained"
									color="error"
									className=" hover:bg-[#ddf3ff] hover:text-[#5f9cbf]">
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
