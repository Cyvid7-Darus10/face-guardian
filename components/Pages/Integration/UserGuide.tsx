import Disclosure from "@/components/Atom/Disclosure";
import Markdown from "./Markdown";
import { installation, usage } from "./markdownContents";

const UserGuide = () => {
	return (
		<div className="flex flex-col items-center w-full gap-5 mt-10">
			<Disclosure title="Installation">
				<Markdown content={installation} />
			</Disclosure>
			<Disclosure title="Usage">
				<Markdown content={usage} />
			</Disclosure>
		</div>
	);
};

export default UserGuide;
