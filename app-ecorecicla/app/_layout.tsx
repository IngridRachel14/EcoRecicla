import AuthProvider from "@/providers/AuthProvider";
import { useReferralStore } from "@/providers/useReferralStore";
import { useFonts } from 'expo-font';
import { Slot } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";

export default function RootLayout() {
  const setReferralCode = useReferralStore((state) => state.setReferralCode);
  const loadReferralCode = useReferralStore((state) => state.loadReferralCode);

  const [loaded] = useFonts({
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
  });

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Roboto-Regular' };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const match = url.match(/[?&]referralCode=([^&]+)/);
        if (match) {
          const code = decodeURIComponent(match[1]);
          setReferralCode(code);
        } else {
          loadReferralCode();
        }
      } else {
        loadReferralCode();
      }
    });
  }, []);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
}