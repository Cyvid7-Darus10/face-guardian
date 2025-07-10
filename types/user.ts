// User profile interface based on Supabase profiles table
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  authenticated: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication-related types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  app_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

// Store state interface
export interface UserDataState {
  userData: UserProfile | null;
  setUserData: (value: UserProfile | null) => void;
  clearUserData: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
