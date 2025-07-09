import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function CustomDisclosure({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="mx-auto w-full rounded-2xl bg-white">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-[#ddf3ff] px-4 py-2 text-left text-sm font-medium text-[#5f9cbf] hover:text-white hover:bg-[#9fdbfd] focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-white`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
