import { create } from 'zustand';

interface UserDataState {
  userData: any;
  setUserData: (value: any) => void;
}

const useUserDataStore = create<UserDataState>()(set => ({
  userData: null,
  setUserData: (value: any) => set({ userData: value }),
}));

export default useUserDataStore;
