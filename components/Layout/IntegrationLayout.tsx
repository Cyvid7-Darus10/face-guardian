import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  DocumentTextIcon,
  CubeIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Import atomic components
import Breadcrumbs from '@/components/Atom/Breadcrumbs';
import NavigationSidebar from '@/components/Common/NavigationSidebar';

const IntegrationLayout = ({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: ReactNode;
}) => {
  const router = useRouter();

  const navigationItems = [
    {
      title: 'Guide',
      href: '/integration/guide',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      description: 'Step-by-step integration guide',
    },
    {
      title: 'Application',
      href: '/integration/application',
      icon: <CubeIcon className="w-5 h-5" />,
      description: 'Manage your applications',
    },
  ];

  const currentIndex = navigationItems.findIndex(
    item => item.title === pageTitle
  );
  const nextPage =
    currentIndex < navigationItems.length - 1
      ? navigationItems[currentIndex + 1]
      : null;
  const prevPage = currentIndex > 0 ? navigationItems[currentIndex - 1] : null;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/home' },
    { label: 'Integration' },
    { label: pageTitle, isActive: true },
  ];

  const progressSteps = navigationItems.map((item, index) => ({
    id: item.title.toLowerCase(),
    title: item.title,
    isCompleted: index < currentIndex,
    isCurrent: index === currentIndex,
  }));

  const getPageTitle = () => {
    switch (pageTitle) {
      case 'Guide':
        return 'Integration Guide';
      case 'Application':
        return 'Application Management';
      default:
        return pageTitle;
    }
  };

  const getPageDescription = () => {
    switch (pageTitle) {
      case 'Guide':
        return 'Learn how to integrate Face Guardian into your application';
      case 'Application':
        return 'Configure and manage your registered applications';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-2">{getPageDescription()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <NavigationSidebar
            title="Integration"
            items={navigationItems}
            currentItem={pageTitle}
            showProgress={true}
            progressSteps={progressSteps}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 lg:p-8">{children}</div>
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              {prevPage && (
                <Link
                  href={prevPage.href}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ChevronRightIcon className="w-4 h-4 rotate-180" />
                  <div>
                    <div className="text-xs text-gray-500">Previous</div>
                    <div>{prevPage.title}</div>
                  </div>
                </Link>
              )}
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {navigationItems.length}
              </span>
            </div>
            <div className="flex-1 text-right">
              {nextPage && (
                <Link
                  href={nextPage.href}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Next</div>
                    <div>{nextPage.title}</div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationLayout;
