import { ReactNode } from "react";
import Link from "next/link";

const IntegrationLayout = ({
	pageTitle,
	children,
}: {
	pageTitle: string;
	children: ReactNode;
}) => {
	return (
		<div className="max-w-[1440px] mx-auto mt-10 h-full px-2 lg:pl-8">
			<div className="flex flex-col lg:flex-row gap-5 h-full">
				<div className="px-10 lg:px-0 flex flex-row lg:flex-col lg:h-full justify-between lg:justify-start items-start gap-5 lg:border-r-2 lg:pr-10">
					<Link
						href="/integration/api"
						className={`text-xl font-bold ${
							pageTitle === "API" && "text-[#5f9cbf]"
						}`}>
						API
					</Link>
					<Link
						href="/integration/guide"
						className={`text-xl font-bold ${
							pageTitle === "Guide" && "text-[#5f9cbf]"
						}`}>
						Guide
					</Link>
					<Link
						href="/integration/application"
						className={`text-xl font-bold ${
							pageTitle === "Application" && "text-[#5f9cbf]"
						}`}>
						Application
					</Link>
				</div>
				{children}
			</div>
		</div>
	);
};

export default IntegrationLayout;
