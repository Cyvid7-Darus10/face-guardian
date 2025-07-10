import { create } from 'zustand';
import { UserProfile, UserDataState } from '@/types/user';

const useUserDataStore = create<UserDataState>()(set => ({
  userData: null,
  isLoading: false,
  setUserData: (value: UserProfile | null) => set({ userData: value }),
  clearUserData: () => set({ userData: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export default useUserDataStore;
