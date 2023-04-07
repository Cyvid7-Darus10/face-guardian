import { SupabaseClient } from "@supabase/auth-helpers-react";

export const faceData = async (supabase: SupabaseClient) => {
	const { data, error } = await supabase
		.from("face_descriptors")
		.select("descriptors, profile_id(first_name, id, authenticated)");

	if (error) {
		console.error(error);
	} else {
		const cleanedData: { [key: string]: { name: string; descriptors: any[] } } =
			{};
		data.forEach((item: any) => {
			if (item.profile_id.authenticated) {
				if (!cleanedData[item.profile_id.id]) {
					cleanedData[item.profile_id.id] = {
						name: item.profile_id.id,
						descriptors: [],
					};
				}
				cleanedData[item.profile_id.id].descriptors.push(item.descriptors);
			}
		});
		return cleanedData;
	}

	return data;
};
