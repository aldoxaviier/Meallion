import CustomHeader from "@/app/components/CustomHeader";
import { Stack } from "expo-router";

export default function _Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"></Stack.Screen>
            <Stack.Screen 
                name="likes" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Likes" />
                }}
            />
        </Stack>
    )
}