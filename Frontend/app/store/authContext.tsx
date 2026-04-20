import { createContext, useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { setTokenGetter, registerAuthHandlers, api } from "../utils/api";
import Constants from "expo-constants";

interface AuthContextType {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const accessTokenRef = useRef<string>(accessToken);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    registerAuthHandlers(login, logout);
    setTokenGetter(() => accessTokenRef.current);
  }, []);

  

  const login = async (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken)
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        console.log("push token:", pushToken);
        await api.put('/auth/updatePushToken', 
          { expo_push_token: pushToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch (error) {
      console.error("Error push token:", error);
    }
  };

  const logout = async () => {
    setAccessToken("");
    await SecureStore.deleteItemAsync("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted!');
      return null;
    }
    
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId 
      })).data;
    } catch (e) {
      console.log("Error get token:", e);
    }
  } else {
    console.log("Use a physical device for notifications!");
  }

  return token;
}

export default AuthProvider;
export { AuthContext };