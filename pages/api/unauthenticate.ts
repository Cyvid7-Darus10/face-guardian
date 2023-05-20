import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/utils/session";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(authenticateRoute, sessionOptions);

async function authenticateRoute(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Destroy the current session
		req.session.destroy();

		// Return success status after session destruction
		res
			.status(200)
			.json({ message: "Session destroyed successfully", status: true });
	} catch (error) {
		// Handle any errors
		res.status(500).json({ message: (error as Error).message });
	}
}
