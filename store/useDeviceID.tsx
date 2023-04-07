import { create } from "zustand";

interface deviceIDState {
	deviceID: any;
	setDeviceID: (value: any) => void;
}

const useDeviceID = create<deviceIDState>()((set) => ({
	deviceID: null,
	setDeviceID: (value: any) => set({ deviceID: value }),
}));

export default useDeviceID;
