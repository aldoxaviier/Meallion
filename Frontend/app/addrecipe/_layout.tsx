import { Stack } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import RecipeProvider from "../store/addRecipeContext";
export default function _Layout() {
    return (
        <>
        <RecipeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen 
                name="index" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Add Recipe" />
                }}
            />
            <Stack.Screen 
                name="ingredients" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Add Ingredients" />
                }}
            />
            <Stack.Screen 
                name="steps" 
                options={{ 
                    headerShown: true,
                    header: () => <CustomHeader title="Add Steps" />
                }}
            />
        </Stack>
        </RecipeProvider>
        </>
    )
}