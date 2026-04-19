// app/_layout.tsx
import { Stack } from "expo-router";
import AuthProvider, { AuthContext } from "./store/authContext";
import ProfileDataProvider from "./store/profileDataContext";
import TenRecipeProvider from "./store/tenRecipeContext";
import "./globals.css";
import { useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const authContext = useContext(AuthContext);
  const user = authContext?.accessToken;
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Fogsta": require("../assets/fonts/Fogsta.ttf"),
    "BRSegma-600": require("../assets/fonts/BRSegma-600.otf"),
    "BRSegma-500": require("../assets/fonts/BRSegma-500.otf"),
    "BRSegma-300": require("../assets/fonts/BRSegma-300.otf"),
  });

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        await Asset.loadAsync([
          require("../assets/images/pescatarian.png"),
          require("../assets/images/dairy-free.png"),
          require("../assets/images/gluten-free.png"),
          require("../assets/images/pork-free.png"),
          require("../assets/images/vegan.png"),
          require("../assets/images/vegetarian.png"),
        ]);
        setAssetsLoaded(true);
      } catch (error) {
        console.warn("Asset loading error:", error);
        setAssetsLoaded(true); // still proceed on error
      }
    };

    loadAppResources();
  }, []);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        setRefreshToken(storedRefreshToken);
      } catch (e) {
        console.warn("Error loading refresh token:", e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadTokens();
  }, [user]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && assetsLoaded && !isAuthLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded, isAuthLoading]);

  // Return null while loading — native splash stays visible
  if (!fontsLoaded || !assetsLoaded || isAuthLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Protected guard={!!refreshToken}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="addrecipe" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!refreshToken}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TenRecipeProvider>
        <ProfileDataProvider>
          <LayoutContent />
        </ProfileDataProvider>
      </TenRecipeProvider>
    </AuthProvider>
  );
}