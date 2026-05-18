import { createContext, useState, useContext, useEffect } from "react";
import { setTokenGetter, api } from "../utils/api";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  otp?: string;
}

interface RegisterContextType {
  registerData: RegisterData;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterData>>;
  resetRegisterData: () => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

const RegisterContext = createContext<RegisterContextType | null>(null);

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const resetRegisterData = () => setRegisterData({ name: "", email: "", password: "", otp: "" });

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);

    const setupPushToken = async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await api.put('/auth/updatePushToken', 
            { expo_push_token: pushToken },
            { headers: { Authorization: `Bearer ${access}` } }
          );
        }
      } catch (error) {
        console.error("Error push token during register:", error);
      }
    };
    setupPushToken();
  };

  useEffect(() => {
    setTokenGetter(() => accessToken);
  }, [accessToken]);

  return (
    <RegisterContext.Provider value={{ 
      registerData, 
      setRegisterData, 
      resetRegisterData,
      accessToken,
      refreshToken,
      setTokens
    }}>
      {children}
    </RegisterContext.Provider>
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
      SecureStore.setItemAsync("pushToken", token);
    } catch (e) {
      console.log("Error get token:", e);
    }
  } else {
    console.log("Use a physical device for notifications!");
  }

  return token;
}

export {RegisterContext}
export default RegisterProvider;