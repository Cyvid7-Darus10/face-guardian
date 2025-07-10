import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { toast } from 'react-toastify';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  created_at: string;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  clearError: () => void;
}

// Initial state
const initialState: AppState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  theme: 'light',
  notifications: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const supabaseClient = useSupabaseClient();
  const session = useSession();

  // Initialize user data
  useEffect(() => {
    const initializeUser = async () => {
      if (session?.user) {
        try {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          if (data) {
            dispatch({
              type: 'SET_USER',
              payload: {
                id: data.id,
                email: data.email || session.user.email || '',
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                avatar: data.avatar_url || '',
                created_at: data.created_at,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initializeUser();
  }, [session, supabaseClient]);

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!',
      });

      return true;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message,
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;

      dispatch({ type: 'SET_USER', payload: null });
      showNotification({
        type: 'success',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification({
        type: 'error',
        title: 'Logout Failed',
        message: error.message,
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!state.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          avatar_url: userData.avatar,
        })
        .eq('id', state.user.id);

      if (error) throw error;

      dispatch({
        type: 'SET_USER',
        payload: { ...state.user, ...userData },
      });

      showNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const showNotification = (notification: Omit<Notification, 'id'>): void => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Show toast
    toast[notification.type](notification.title, {
      autoClose: notification.duration || 5000,
    });

    // Auto remove notification
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, notification.duration || 5000);
  };

  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    updateUser,
    showNotification,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
