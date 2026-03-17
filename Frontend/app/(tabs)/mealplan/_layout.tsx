import { Stack } from "expo-router";

export default function _Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"></Stack.Screen>
            <Stack.Screen name="likes" options={{ headerShown: true, title: 'Your Likes Food' }}></Stack.Screen>
        </Stack>
    )
}