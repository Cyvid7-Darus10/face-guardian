import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/Atom/ConfirmationModal";
import HiddenInput from "@/components/Atom/HiddenInput";

interface IFormInput {
	name: string;
	domain: string;
	redirectTo: string;
}

const AppDetails = ({
	appList,
	selectedApp,
	setAppList,
	setSelectedApp,
}: {
	appList: any;
	selectedApp: any;
	setAppList: any;
	setSelectedApp: any;
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<IFormInput>({
		defaultValues: {
			name: selectedApp?.name || "",
			domain: selectedApp?.domain || "",
			redirectTo: selectedApp?.redirect_to || "",
		},
	});

	useEffect(() => {
		// Update the default values when the selected app changes
		reset({
			name: selectedApp?.name || "",
			domain: selectedApp?.domain || "",
			redirectTo: selectedApp?.redirect_to || "",
		});
	}, [selectedApp, reset]);

	const supabaseClient = useSupabaseClient();

	const onSubmit: SubmitHandler<IFormInput> = async (appData) => {
		const { error } = await supabaseClient
			.from("apps")
			.update({
				name: appData.name,
				domain: appData.domain,
				redirect_to: appData.redirectTo,
			})
			.eq("id", selectedApp.id);

		if (error) {
			toast.error("Error updating app");
			console.error(error);
			return;
		} else {
			toast.success("App updated successfully");
		}
	};

	const onDelete = async () => {
		// show confirmation modal

		const { error } = await supabaseClient
			.from("apps")
			.delete()
			.eq("id", selectedApp.id);

		if (error) {
			toast.error("Error deleting app");
			console.error(error);
			return;
		} else {
			const newAppList = appList.filter(
				(app: any) => app.id !== selectedApp.id
			);

			setAppList(newAppList);
			setSelectedApp(newAppList[0]);
			toast.success("App deleted successfully");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="w-full border-l pl-4 h-full">
			<div className="flex flex-col text-[16px] font-[400] gap-5">
				<div className="text-left w-full">
					<label htmlFor="firstName">App ID</label>
					<HiddenInput content={selectedApp?.id} />
				</div>
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
						{...register("domain", { required: true })}
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
						{...register("redirectTo", { required: true })}
					/>
					{errors.redirectTo && (
						<span className="text-red-400">
							Redirection Link field is required
						</span>
					)}
				</div>
				<div className="flex flex-row justify-between gap-5">
					<ConfirmationModal title="Delete App" onConfirm={onDelete}>
						Are you sure you want to delete this app?
					</ConfirmationModal>
					<button
						type="submit"
						className="mt-5 w-full inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
						Save
					</button>
				</div>
			</div>
		</form>
	);
};

export default AppDetails;
