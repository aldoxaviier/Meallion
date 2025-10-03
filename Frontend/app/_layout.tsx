// app/_layout.tsx
import { Stack } from "expo-router";
import AuthProvider, { AuthContext } from "./store/authContext";
import "./globals.css";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import CustomSplash from "./components/splashscreen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

// ✅ Prevent native splash from hiding automatically
SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const authContext = useContext(AuthContext);
  const user = authContext?.accessToken;
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Fogsta': require('../assets/fonts/Fogsta.ttf'),
    'BRSegma-600': require('../assets/fonts/BRSegma-600.otf'),
    'BRSegma-500': require('../assets/fonts/BRSegma-500.otf'),
    'BRSegma-300': require('../assets/fonts/BRSegma-300.otf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // ✅ Always keep the splash visible for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Load stored refresh token
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        console.log("Stored refresh token:", storedRefreshToken);
        setRefreshToken(storedRefreshToken);
      } catch (e) {
        console.warn("Error loading refresh token:", e);
      } finally {
        // Mark app ready and hide splash
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, [user]);

  // Show custom splash until app is ready
  if (!isAppReady) {
    return <CustomSplash />;
  }

  // After splash ends, render main app
  return (
    <>
    <StatusBar style="light" />
    <Stack>
      <Stack.Protected guard={!!refreshToken}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!refreshToken}>
        <Stack.Screen name="onboard" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
