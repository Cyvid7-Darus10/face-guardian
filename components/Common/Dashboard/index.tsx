import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  CubeIcon,
  UsersIcon,
  CheckCircleIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import useUserDataStore from '@/store/userDataStore';
import { toast } from 'react-toastify';
import ConfirmationModal from '@/components/Atom/ConfirmationModal';
import StatsCard from '@/components/Atom/StatsCard';
import QuickActionCard from '@/components/Common/QuickActionCard';
import RecentActivity from '@/components/Common/RecentActivity';

interface DashboardStats {
  totalApps: number;
  totalTokens: number;
  activeApps: number;
  recentActivity: Array<{
    id: string;
    appName: string;
    action: string;
    timestamp: string;
  }>;
}

interface AppToken {
  appId: string;
  name: string;
  lastAccessed: string;
  url: string;
  isActive: boolean;
}

const Dashboard = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { userData } = useUserDataStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalApps: 0,
    totalTokens: 0,
    activeApps: 0,
    recentActivity: [],
  });
  const [appTokens, setAppTokens] = useState<AppToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userData?.id]);

  const fetchDashboardData = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      // Fetch app tokens
      const { data: tokensData, error: tokensError } = await supabaseClient
        .from('tokens')
        .select('*, apps:app_id(*)')
        .eq('profile_id', userData.id)
        .order('created_at', { ascending: false });

      if (tokensError) throw tokensError;

      // Process tokens data
      const uniqueApps = tokensData?.reduce((acc, curr) => {
        if (!acc[curr.app_id]) {
          acc[curr.app_id] = curr;
        }
        return acc;
      }, {});

      const processedTokens = Object.values(uniqueApps || {}).map(
        (app: any) => ({
          appId: app.app_id,
          name: app.apps.name,
          lastAccessed: app.created_at,
          url: app.apps.domain,
          isActive:
            new Date(app.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Active if used in last 7 days
        })
      );

      setAppTokens(processedTokens);

      // Calculate stats
      const activeApps = processedTokens.filter(app => app.isActive).length;
      setStats({
        totalApps: processedTokens.length,
        totalTokens: tokensData?.length || 0,
        activeApps,
        recentActivity: processedTokens.slice(0, 5).map(app => ({
          id: app.appId,
          appName: app.name,
          action: 'Authenticated',
          timestamp: app.lastAccessed,
        })),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
  };

  const deleteToken = async (appId: string, appName: string) => {
    try {
      const { error } = await supabaseClient
        .from('tokens')
        .delete()
        .eq('app_id', appId)
        .eq('profile_id', userData?.id);

      if (error) throw error;

      toast.success(`Successfully revoked access to ${appName}`);
      setAppTokens(prev => prev.filter(app => app.appId !== appId));

      // Update stats
      setStats(prev => ({
        ...prev,
        totalApps: prev.totalApps - 1,
        totalTokens: prev.totalTokens - 1,
      }));
    } catch (error) {
      console.error('Error deleting token:', error);
      toast.error('Failed to revoke access');
    }
  };

  const handleDeleteClick = (appId: string, appName: string) => {
    setAppToDelete({ id: appId, name: appName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (appToDelete) {
      await deleteToken(appToDelete.id, appToDelete.name);
      setDeleteModalOpen(false);
      setAppToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAppToDelete(null);
  };

  const filteredTokens = showInactive
    ? appTokens
    : appTokens.filter(app => app.isActive);

  const quickActions = [
    {
      title: 'Integration Guide',
      description: 'Learn how to integrate',
      icon: <PlusIcon className="w-4 h-4" />,
      href: '/integration/guide',
      color: 'blue' as const,
    },
    {
      title: 'Manage Apps',
      description: 'Configure your applications',
      icon: <Cog6ToothIcon className="w-4 h-4" />,
      href: '/integration/application',
      color: 'green' as const,
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="" value="" icon={<div />} loading={true} />
          <StatsCard title="" value="" icon={<div />} loading={true} />
          <StatsCard title="" value="" icon={<div />} loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your applications and monitor your authentication activity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/integration/guide">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Create App
            </button>
          </Link>
          <Link href="/integration/application">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Cog6ToothIcon className="w-4 h-4" />
              Manage Apps
            </button>
          </Link>
          <button
            onClick={logoutUser}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Applications"
          value={stats.totalApps}
          icon={<CubeIcon className="w-full h-full" />}
          color="blue"
        />
        <StatsCard
          title="Active Apps"
          value={stats.activeApps}
          icon={<CheckCircleIcon className="w-full h-full" />}
          color="green"
        />
        <StatsCard
          title="Total Authentications"
          value={stats.totalTokens}
          icon={<UsersIcon className="w-full h-full" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connected Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Connected Applications
                </h2>
                <button
                  onClick={() => setShowInactive(!showInactive)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showInactive ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                  {showInactive ? 'Hide Inactive' : 'Show All'}
                </button>
              </div>
            </div>
            <div className="p-6">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-12">
                  <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No applications connected
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Connect your first application to get started
                  </p>
                  <Link href="/integration/guide">
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Get Started
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTokens.map(app => (
                    <div
                      key={app.appId}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${app.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {app.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Last accessed:{' '}
                            {new Date(app.lastAccessed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Visit website"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteClick(app.appId, app.name)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentActivity activities={stats.recentActivity} />
          <QuickActionCard title="Quick Actions" actions={quickActions} />
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Revoke Access"
        message={`Are you sure you want to revoke access to ${appToDelete?.name}? This action cannot be undone.`}
        confirmText="Revoke"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Dashboard;
