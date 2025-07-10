import React, { useState } from 'react';
import {
  CubeIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import TabNavigation from '@/components/Common/TabNavigation';
import { App } from '@/types';
import AppHeader from './AppHeader';
import AppOverview from './AppOverview';
import AppSettings from './AppSettings';
import AppIntegration from './AppIntegration';

interface AppDetailsProps {
  app: App;
  onAppUpdated: (app: App) => void;
  onAppDeleted: (appId: string) => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({
  app,
  onAppUpdated,
  onAppDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'integration'
  >('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <CubeIcon className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Cog6ToothIcon className="w-4 h-4" />,
    },
    {
      id: 'integration',
      label: 'Integration',
      icon: <CodeBracketIcon className="w-4 h-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AppOverview app={app} />;
      case 'settings':
        return (
          <AppSettings
            app={app}
            onAppUpdated={onAppUpdated}
            onAppDeleted={onAppDeleted}
          />
        );
      case 'integration':
        return <AppIntegration app={app} />;
      default:
        return <AppOverview app={app} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <AppHeader app={app} />

      {/* Tab Navigation */}
      <div className="px-8 pt-8 pb-2">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={tabId => setActiveTab(tabId as any)}
          variant="underline"
        />
      </div>

      {/* Tab Content */}
      <div className="px-8 pb-8">{renderTabContent()}</div>
    </div>
  );
};

export default AppDetails;
