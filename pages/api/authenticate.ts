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
	// const appId = "6d30891b-50de-401e-8dc2-b5af36a24b94";
	// const clientSecret =
	// "U2FsdGVkX18yg0ug3i04CFKc5B7YnoozRd8lbroU2k3KNxNerIeajRpgYB0Q0p0/m3nwS6I8Yvc6CoKdYtYO099qk+iJMROvjaBPwArp8etwBfaLUuQc4Q7EaSzWrpHk1zFZla24F29tr4lUad1UMJN2WJ8B9v/7UBRs+GIynehCbSe6vvase+wAVrT7dWiQ4/O5B2mZ/75IbHgwDHeeK9IOyBcMspE/+q2Nqc9BtLhmvVDjZMkdsE66N6PhEqhzFGuHRt99Wk7vduYYYAOv/fNXdKOCG/izsAe25SYdBQE2o9Af/j4wQwXetpDzj/8gWMEmT+x6Dht64g9TJBFpdPrHwgnBM1cSN1tncirzRNGsNDS1XVOR5s4WbX0Pawvu";
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
