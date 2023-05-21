import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function requestToken(
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

	// Get the authorization code from the request body
	const { authorizationCode } = req.body;

	if (!authorizationCode) {
		return res.status(400).json({ message: "No authorization code provided" });
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	const supabase = createClient(supabaseUrl, supabaseKey);

	try {
		// Request a token using the authorization code
		let { data, error } = await supabase
			.from("tokens")
			.select("token")
			.eq("code", authorizationCode)
			.single();

		if (error) {
			return res.status(500).json({ message: error.message, status: false });
		}

		if (!data) {
			return res
				.status(404)
				.json({ message: "Token not found", status: false });
		}

		return res
			.status(200)
			.json({ message: "Token retrieved", status: true, token: data.token });
	} catch (error) {
		return res.status(500).json({ message: (error as Error).message });
	}
}
