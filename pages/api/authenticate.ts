import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/utils/session";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default withIronSessionApiRoute(authenticateRoute, sessionOptions);

async function authenticateRoute(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.status(200).end();
		return;
	}

	const { appId, clientSecret } = req.body;
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	const supabase = createClient(supabaseUrl, supabaseKey);

	try {
		let { data: clientData, error } = await supabase
			.from("clients")
			.select("*")
			.eq("secret_key", clientSecret)
			.single();

		if (error) {
			return res.status(500).json({ message: error.message, status: false });
		}

		if (clientData) {
			const clientId = clientData.id;
			let { data: appData, error: clientError } = await supabase
				.from("apps")
				.select("*")
				.eq("id", appId)
				.single();

			if (clientError) {
				return res
					.status(500)
					.json({ message: clientError.message, status: false });
			}

			if (clientData && appData?.client_id !== clientId) {
				return res
					.status(401)
					.json({ message: "Unauthorized. Invalid client id.", status: false });
			} else {
				req.session.clientData = clientData;
				req.session.appData = appData;
				await req.session.save();
				return res.status(200).json({ message: "Authorized", status: true });
			}
		} else {
			return res
				.status(401)
				.json({ message: "Unauthorized. Invalid client secret." });
		}
	} catch (error) {
		return res.status(500).json({ message: (error as Error).message });
	}
}
