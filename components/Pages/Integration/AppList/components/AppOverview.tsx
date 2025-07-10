import React from 'react';
import { App } from '@/types';
import AppIdCard from './AppIdCard';
import AppInfoGrid from './AppInfoGrid';
import AppConfigCard from './AppConfigCard';

interface AppOverviewProps {
  app: App;
}

const AppOverview: React.FC<AppOverviewProps> = ({ app }) => {
  return (
    <div className="space-y-6">
      {/* Application ID Section */}
      <AppIdCard appId={app.id} />

      {/* App Information Grid */}
      <AppInfoGrid createdAt={app.created_at} updatedAt={app.updated_at} />

      {/* Current Configuration */}
      <AppConfigCard app={app} />
    </div>
  );
};

export default AppOverview;
