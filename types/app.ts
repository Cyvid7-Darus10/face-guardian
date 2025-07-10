// Application interface
export interface App {
  id: string;
  name: string;
  domain: string;
  redirect_to: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  is_active?: boolean;
  description?: string;
  logo_url?: string;
}

// Token interface
export interface Token {
  id: string;
  app_id: string;
  profile_id: string;
  token: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  apps?: App;
}

// Dashboard stats interface
export interface DashboardStats {
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

// App token interface for dashboard
export interface AppToken {
  appId: string;
  name: string;
  lastAccessed: string;
  url: string;
  isActive: boolean;
}

// Form data interfaces
export interface AppFormData {
  name: string;
  domain: string;
  redirectTo: string;
  description?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Tab navigation interface
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Button variant and size types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
