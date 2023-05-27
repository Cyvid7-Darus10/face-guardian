import { useState } from "react";
import AppCreationModal from "./components/AppCreationModal";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useUserDataStore from "@/store/userDataStore";
import { toast } from "react-toastify";

interface IFormInput {
	name: string;
	domain: string;
	redirectTo: string;
}

const AppCreation = ({ setAppList }: { setAppList: any }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<IFormInput>();
	const supabaseClient = useSupabaseClient();
	const { userData } = useUserDataStore();

	let [isModalOpen, setIsModalOpen] = useState(false);

	const onSubmit: SubmitHandler<IFormInput> = async (appData) => {
		const appDataList = {
			name: appData.name,
			domain: appData.domain,
			redirect_to: appData.redirectTo,
			profile_id: userData.id,
		};

		const { data, error } = await supabaseClient
			.from("apps")
			.insert([appDataList])
			.select();

		if (error) {
			toast.error("Error creating app");
			console.error(error);
			return;
		} else {
			setAppList((prev: any) => [...prev, data[0]]);
			setIsModalOpen(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-full gap-5">
			<AppCreationModal
				title="Create an App"
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col text-[16px] font-[400] gap-5">
						<div className="text-left w-full">
							<label htmlFor="firstName">Name</label>
							<input
								className="rounded-sm w-full py-2 px-4 mt-2 h-[48px] border-b-2 bg-slate-50"
								id="name"
								type="text"
								{...register("name", { required: true })}
							/>
							{errors.name && (
								<span className="text-red-400">Name field is required</span>
							)}
						</div>
						<div className="text-left w-full">
							<label htmlFor="firstName">Domain</label>
							<input
								className="rounded-sm w-full py-2 px-4 mt-2 h-[48px] border-b-2 bg-slate-50"
								id="domain"
								type="text"
								{...register("domain", { required: true, maxLength: 600 })}
							/>
							{errors.domain && (
								<span className="text-red-400">Domain field is required</span>
							)}
						</div>
						<div className="text-left w-full">
							<label htmlFor="firstName">Redirection Link</label>
							<input
								className="rounded-sm w-full py-2 px-4 mt-2 h-[48px] border-b-2 bg-slate-50"
								id="redirectTo"
								type="text"
								{...register("redirectTo", { required: true, maxLength: 600 })}
							/>
							{errors.redirectTo && (
								<span className="text-red-400">
									Redirection Link field is required
								</span>
							)}
						</div>
						<button
							type="submit"
							className="mt-5 inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
							Save
						</button>
					</div>
				</form>
			</AppCreationModal>
		</div>
	);
};

export default AppCreation;
