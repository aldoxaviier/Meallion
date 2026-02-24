import { Stack } from "expo-router";
import CustomHeader from "../../components/CustomHeader";

export default function _Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'profile' }}></Stack.Screen>
        </Stack>
    )
}