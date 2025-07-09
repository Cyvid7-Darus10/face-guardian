import { ReactNode } from 'react';
import Link from 'next/link';

const IntegrationLayout = ({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: ReactNode;
}) => {
  const links = [
    { title: 'Guide', href: '/integration/guide' },
    { title: 'Application', href: '/integration/application' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto mt-10 h-full px-2 lg:pl-8">
      <div className="flex flex-col lg:flex-row gap-5 h-full">
        <div className="px-10 lg:px-0 flex flex-row lg:flex-col lg:h-full justify-between lg:justify-start items-start gap-5 lg:border-r-2 lg:pr-10">
          {links.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-xl font-bold ${
                pageTitle === title && 'text-[#5f9cbf]'
              }`}
            >
              {title}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};

export default IntegrationLayout;
