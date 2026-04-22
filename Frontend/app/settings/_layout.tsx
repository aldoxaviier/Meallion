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
            <Stack.Screen 
                name="dietaryRequirements" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Dietary Requirements" />
                }}
            />
            <Stack.Screen 
                name="mealTime" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Update My Meal Time" />
                }}
            />
            <Stack.Screen 
                name="dislikesandallergies" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Dislikes and Allergies" />
                }}
            />
        </Stack>
    )
}