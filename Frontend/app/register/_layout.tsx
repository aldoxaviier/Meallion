import { Stack } from "expo-router";
import RegisterProvider from "../store/registerContext";

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="credentials"/>
        <Stack.Screen name="otp"/>
        
      </Stack>
    </RegisterProvider>
  );
}

