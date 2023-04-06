import { SupabaseClient } from "@supabase/auth-helpers-react";

export const faceData = async (supabase: SupabaseClient) => {
	const { data, error } = await supabase
		.from("face_descriptors")
		.select("descriptors, profile_id(first_name)");

	if (error) {
		console.error(error);
	} else {
		const cleanedData: { [key: string]: { name: string; descriptors: any[] } } =
			{};
		data.forEach((item: any) => {
			if (!cleanedData[item.profile_id.first_name]) {
				cleanedData[item.profile_id.first_name] = {
					name: item.profile_id.first_name,
					descriptors: [],
				};
			}
			cleanedData[item.profile_id.first_name].descriptors.push(
				item.descriptors
			);
		});
		return cleanedData;
	}

	return data;
};
