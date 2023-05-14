import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/utils/session";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default withIronSessionApiRoute(authenticateRoute, sessionOptions);

// after a successfull login, I must save the user's data on the session
// create a method in the npm package to access the session data
// create a logout method in the npm package that will destroy the session
// create an api to save in the session iron the user's data
// use this guide, https://stackoverflow.com/questions/68554962/pass-data-from-nextjs-link-component-and-use-it-in-getstaticprops
async function authenticateRoute(req: NextApiRequest, res: NextApiResponse) {
	const { appId, clientSecret } = req.body;
	// const appId = "49d14725-e31b-47d8-a1d3-573e79a3a1df";
	// const clientSecret =
	// "U2FsdGVkX18YWoU7GcuHtS0u63TeXr+lyy51VElV6ejtxaI3+XuTYBptN5s1aTyv8V4YjERL7l/VajVNy0V5XvOxdQBSMY8sLzDM9mbvsE29Dg5R4Eco5rNrWAjaAY1UzkN6N6tKwkl5yyQUE/YbotDQYlrXm4PL8mZ+tLdBgD5a4B7BQnQFTw9OsiKCAATzs1Sww7tPGbVGTmwroYoasmgPexgNIAkRiPPhGA1wsBZTPxgtwYrJ5S56pRczWD1/UuvZRehbCNNZI9k7lbk6E4SmLJWNBFFzbvz/XlMeZhknhFQRvqW6FO2TuAyGPQshkceRLW3VuPRMPonMULWovbpDlZqR08kxI8v6B/rBMMyPPhr19oGCkJbNLsoXNIJ8";
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
			res.status(500).json({ message: error.message, status: false });
		}

		if (clientData) {
			const clientId = clientData.id;
			let { data: appData, error: clientError } = await supabase
				.from("apps")
				.select("*")
				.eq("id", appId)
				.single();

			if (clientError) {
				res.status(500).json({ message: clientError.message, status: false });
			}

			if (clientData && appData?.client_id !== clientId) {
				res
					.status(401)
					.json({ message: "Unauthorized. Invalid client id.", status: false });
			} else {
				req.session.clientData = clientData;
				req.session.appData = appData;
				await req.session.save();
				res.status(200).json({ message: "Authorized", status: true });
			}
		} else {
			res.status(401).json({ message: "Unauthorized. Invalid client secret." });
		}
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
}
