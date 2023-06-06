import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function requestToken(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
			.select("token, expiration_date, created_at")
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

		// Check if the token has expired
		const currentTimestamp = new Date().getTime();
		const expiryTimestamp = new Date(data.expiration_date).getTime();
		const issuedTimestamp = new Date(data.created_at).getTime();

		// Calculate 1/4 of the expiration period
		const quarterExpiryTimestamp =
			issuedTimestamp + (expiryTimestamp - issuedTimestamp) / 4;

		if (currentTimestamp > quarterExpiryTimestamp) {
			return res
				.status(401)
				.json({ message: "Authorization code has expired", status: false });
		}

		return res
			.status(200)
			.json({ message: "Token retrieved", status: true, token: data.token });
	} catch (error) {
		return res.status(500).json({ message: (error as Error).message });
	}
}
