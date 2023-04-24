import Disclosure from "@/components/Atom/Disclosure";
import Markdown from "./Markdown";
import { installation } from "./markdownContents";

const UserGuide = () => {
	return (
		<div className="flex flex-row items-center w-full gap-5 mt-10">
			<Disclosure title="How to use?">
				<Markdown content={installation} />
			</Disclosure>
		</div>
	);
};

export default UserGuide;
