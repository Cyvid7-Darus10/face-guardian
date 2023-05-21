import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function authenticateRoute(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { appId } = req.body;
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	const supabase = createClient(supabaseUrl, supabaseKey);

	try {
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

		return res
			.status(200)
			.json({ message: "Authorized", status: true, appData });
	} catch (error) {
		return res.status(500).json({ message: (error as Error).message });
	}
}
