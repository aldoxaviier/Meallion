import { Stack } from "expo-router";
import RegisterProvider from "../store/registerContext";
import ProfileProvider from "../store/profileContext";
import { Modal } from "react-native";

export default function RegisterLayout() {
  return (
    <ProfileProvider> 
    <RegisterProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="credentials"/>
        <Stack.Screen name="otp"/>
        <Stack.Screen name="otpduplicated"/>
        <Stack.Screen name="profileonboard"/>
        <Stack.Screen name="birthdate"/>
        <Stack.Screen name="personal"/>
        <Stack.Screen name="healthCondition"/>
        <Stack.Screen name="profile"/>
        <Stack.Screen name="allergies"/>
        <Stack.Screen name="preference"/>
      </Stack>
    </RegisterProvider>
    </ProfileProvider>
  );
}

