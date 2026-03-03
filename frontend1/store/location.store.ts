import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface LocationState {
  area: any | null;
  setArea: (area: any) => void;
  loadArea: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  area: null,

  setArea: async (area) => {
    await SecureStore.setItemAsync("selectedArea", JSON.stringify(area));
    set({ area });
  },

  loadArea: async () => {
    const stored = await SecureStore.getItemAsync("selectedArea");
    if (stored) {
      set({ area: JSON.parse(stored) });
    }
  },
}));