// app/_layout.tsx
import { Stack } from "expo-router";
import AuthProvider, { AuthContext } from "./store/authContext";
import './globals.css';
import { useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

function LayoutContent() {
  const authContext = useContext(AuthContext);
  const user = authContext?.accessToken;
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  console.log("Access token in layout:", user);
  useEffect(() => {
    (async () => {
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      console.log("Stored refresh token:", storedRefreshToken);
      setRefreshToken(storedRefreshToken);
    })();
  },[user])

  return (
    <Stack>
      <Stack.Protected guard={!!refreshToken}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!refreshToken}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
