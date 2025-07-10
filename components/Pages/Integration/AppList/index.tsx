import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CubeIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import useUserDataStore from '@/store/userDataStore';
import { toast } from 'react-toastify';
import AppSidebar from './components/AppSidebar';
import AppDetails from './components/AppDetails';
import AppCreationModal from './components/AppCreationModal';

export interface App {
  id: string;
  name: string;
  domain: string;
  redirect_to: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
}

const AppList = () => {
  const supabaseClient = useSupabaseClient();
  const { userData } = useUserDataStore();
  const [appList, setAppList] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      fetchApps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('apps')
        .select('*')
        .eq('profile_id', userData?.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error fetching apps');
        console.error(error);
        return;
      }

      setAppList(data || []);
      if (data && data.length > 0 && !selectedApp) {
        setSelectedApp(data[0]);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAppCreated = (newApp: App) => {
    setAppList(prev => [newApp, ...prev]);
    setSelectedApp(newApp);
    setShowCreateModal(false);
    toast.success('Application created successfully!');
  };

  const handleAppUpdated = (updatedApp: App) => {
    setAppList(prev =>
      prev.map(app => (app.id === updatedApp.id ? updatedApp : app))
    );
    setSelectedApp(updatedApp);
  };

  const handleAppDeleted = (deletedAppId: string) => {
    const newAppList = appList.filter(app => app.id !== deletedAppId);
    setAppList(newAppList);
    setSelectedApp(newAppList.length > 0 ? newAppList[0] : null);
  };

  const filteredApps = appList.filter(
    app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Create */}
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Application
          </button>
        </div>

        {/* App List */}
        <AppSidebar
          apps={filteredApps}
          selectedApp={selectedApp}
          onSelectApp={setSelectedApp}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedApp ? (
          <AppDetails
            app={selectedApp}
            onAppUpdated={handleAppUpdated}
            onAppDeleted={handleAppDeleted}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {appList.length === 0
                  ? 'No applications yet'
                  : 'Select an application'}
              </h3>
              <p className="text-gray-600 mb-6">
                {appList.length === 0
                  ? 'Create your first application to get started with Face Guardian integration.'
                  : 'Choose an application from the sidebar to view and manage its details.'}
              </p>
              {appList.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Your First App
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create App Modal */}
      <AppCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAppCreated={handleAppCreated}
      />
    </div>
  );
};

export default AppList;
