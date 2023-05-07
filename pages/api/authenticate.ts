import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/utils/session";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(authenticateRoute, sessionOptions);

async function authenticateRoute(req: NextApiRequest, res: NextApiResponse) {
	const { clientId, clientSecret } = req.body;
	try {
		req.session.clientId = clientId;
		req.session.clientSecret = clientSecret;
		await req.session.save();
		res.json({ status: "ok" });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
}
