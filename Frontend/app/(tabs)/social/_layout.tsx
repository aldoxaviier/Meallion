import { Stack } from "expo-router";

export default function _Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'social' }}></Stack.Screen>
        </Stack>
    )
}