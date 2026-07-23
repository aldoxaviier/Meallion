import { Stack, useRouter } from "expo-router"; 
import AuthProvider, { AuthContext } from "./store/authContext";
import ProfileDataProvider from "./store/profileDataContext";
import TenRecipeProvider from "./store/tenRecipeContext";
import "./globals.css";
import { useContext, useEffect, useState, useCallback, useRef } from "react"; 
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import ChangePasswordProvider from "./store/changePasswordContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
})

const myDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1A0A0A', 
    card: '#2D1110',       
    text: '#FFF9E7',       
  },
};

const myLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F2E8C6', 
    card: '#FFFFFF',
    text: '#3E0703',       
  },
};

function LayoutContent() {
  const authContext = useContext(AuthContext);
  const user = authContext?.accessToken;
  const refreshToken = authContext?.refreshToken ?? null;
  const isAuthLoading = authContext?.isLoading ?? true;

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  const { colorScheme, setColorScheme } = useColorScheme();
  const router = useRouter(); 
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const [fontsLoaded] = useFonts({
    "Fogsta": require("../assets/fonts/Fogsta.ttf"),
    "BRSegma-600": require("../assets/fonts/BRSegma-600.otf"),
    "BRSegma-500": require("../assets/fonts/BRSegma-500.otf"),
    "BRSegma-300": require("../assets/fonts/BRSegma-300.otf"),
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setColorScheme(savedTheme as 'light' | 'dark');
        } else {
          setColorScheme('light'); 
          await AsyncStorage.setItem('appTheme', 'light');
        }
      } catch (error) {
        console.warn("Error loading theme:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notifications:', notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('User clicked notification. Data:', data);
      
      if (data?.route) {
        router.push(data.route as any); 
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

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
        setAssetsLoaded(true); 
      }
    };

    loadAppResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && assetsLoaded && !isAuthLoading && isThemeLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded, isAuthLoading, isThemeLoaded]);

  if (!fontsLoaded || !assetsLoaded || isAuthLoading || !isThemeLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ThemeProvider value={colorScheme === 'dark' ? myDarkTheme : myLightTheme}>
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
            <Stack.Screen name="otppassword" options={{ headerShown: false }} />
            <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
            <Stack.Screen name="changepassword" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TenRecipeProvider>
        <ProfileDataProvider>
          <ChangePasswordProvider>
            <LayoutContent />
          </ChangePasswordProvider>
        </ProfileDataProvider>
      </TenRecipeProvider>
    </AuthProvider>
  );
}