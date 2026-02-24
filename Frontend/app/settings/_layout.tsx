import { Stack } from "expo-router";
import CustomHeader from "../components/CustomHeader";

export default function _Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="index" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Settings" />
                }}
            />
            <Stack.Screen 
                name="profile" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Profile" />
                }}
            />
        </Stack>
    )
}