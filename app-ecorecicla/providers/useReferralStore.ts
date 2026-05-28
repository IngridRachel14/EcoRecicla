import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ReferralState = {
  referralCode: string | null;
  setReferralCode: (code: string) => void;
  loadReferralCode: () => void;
};

export const useReferralStore = create<ReferralState>((set) => ({
  referralCode: null,
  setReferralCode: (code: string) => {
    AsyncStorage.setItem('referralCode', code);
    set({ referralCode: code });
  },
  loadReferralCode: async () => {
    const code = await AsyncStorage.getItem('referralCode');
    if (code) {
      set({ referralCode: code });
    }
  },
}));