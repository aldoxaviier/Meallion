import { Stack } from "expo-router";

export default function _Layout () {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Home' }}></Stack.Screen>
            <Stack.Screen name="[category]" options={{headerShown: true }} />
        </Stack>
    )
}