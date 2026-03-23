// app/_layout.tsx
import { Stack } from "expo-router";
import AuthProvider, { AuthContext } from "./store/authContext";
import ProfileDataProvider from "./store/profileDataContext";
import TenRecipeProvider from "./store/tenRecipeContext";
import "./globals.css";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import CustomSplash from "./components/splashscreen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const authContext = useContext(AuthContext);
  const user = authContext?.accessToken;

  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    "Fogsta": require("../assets/fonts/Fogsta.ttf"),
    "BRSegma-600": require("../assets/fonts/BRSegma-600.otf"),
    "BRSegma-500": require("../assets/fonts/BRSegma-500.otf"),
    "BRSegma-300": require("../assets/fonts/BRSegma-300.otf"),
  });

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        // Optional delay just for splash feel
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Preload assets (backgrounds, logo, onboarding images, etc.)
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
      } 
    };

    loadAppResources();
  }, []);

 
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        console.log("Stored refresh token:", storedRefreshToken);
        console.log("Access token:", user);
        setRefreshToken(storedRefreshToken);
      } catch (e) {
        console.warn("Error loading refresh token:", e);
      }
    };

    loadTokens();
  }, [user]);

  if(fontsLoaded && assetsLoaded) {
    SplashScreen.hideAsync();
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Protected guard={!!refreshToken}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="addrecipe" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!refreshToken}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
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
      <TenRecipeProvider>
        <ProfileDataProvider>
          <LayoutContent />
        </ProfileDataProvider>
      </TenRecipeProvider>
    </AuthProvider>
  );
}
