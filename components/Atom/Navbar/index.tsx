import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CodeBracketIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { signIn, signOut } from '@/utils/authentication';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import userDataStore from '@/store/userDataStore';

const navigation = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Integration', href: '/integration/guide', icon: CodeBracketIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { userData } = userDataStore();
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <Disclosure
      as="nav"
      className="bg-white shadow-sm border-b border-gray-200"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              {/* Logo and Navigation */}
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <h1 className="text-xl font-bold text-gray-900">
                        Face Guardian
                      </h1>
                      <p className="text-xs text-gray-500">
                        Authentication Platform
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                  {navigation.map(item => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                          'inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium rounded-t-lg transition-all duration-200'
                        )}
                        aria-current={
                          pathname === item.href ? 'page' : undefined
                        }
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Right side - User menu */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* User menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
                      <div className="flex items-center gap-3">
                        {userData?.avatar_url ? (
                          <Image
                            className="h-8 w-8 rounded-full object-cover"
                            src={userData.avatar_url}
                            alt={userData.first_name || 'User'}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {userData?.first_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        {userData && (
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">
                              {userData.first_name || 'User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {userData.email}
                            </div>
                          </div>
                        )}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userData ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {userData.first_name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {userData.first_name || 'User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userData.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active
                                      ? 'bg-red-50 text-red-600'
                                      : 'text-gray-700',
                                    'flex w-full items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600'
                                  )}
                                  onClick={() =>
                                    signOut(router, supabaseClient)
                                  }
                                >
                                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700',
                                'flex w-full items-center px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600'
                              )}
                              onClick={() => signIn(router)}
                            >
                              <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-3" />
                              Sign in
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3 px-2">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium rounded-r-lg'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {userData ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {userData.first_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {userData.first_name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {userData.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <button
                      onClick={() => signOut(router, supabaseClient)}
                      className="flex w-full items-center px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1 px-2">
                  <button
                    onClick={() => signIn(router)}
                    className="flex w-full items-center px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
