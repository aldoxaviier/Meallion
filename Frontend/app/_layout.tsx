// app/_layout.tsx
import { Stack } from "expo-router";
import AuthProvider, { AuthContext } from "./store/authContext";
import './globals.css';
import { useContext } from "react";

function LayoutContent() {
  const user = useContext(AuthContext); // Now it's inside the provider
  console.log("User token in layout:", user?.token);

  return (
    <Stack>
      <Stack.Protected guard={!!user?.token}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user?.token}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />   {/* Wrapped correctly now */}
    </AuthProvider>
  );
}
