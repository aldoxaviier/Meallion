import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RecipeContext } from "../store/addRecipeContext";
import { router } from "expo-router";
import { api } from "../utils/api";
import { useColorScheme } from "nativewind";

type Step = {
    id: number;
    description: string;
};

const Steps = () => {
    const [ingredients, setIngredients] = useState<Step[]>([
        { id: 1, description: "" },
    ]);
    const [nextId, setNextId] = useState(3);
    const recipeContext = useContext(RecipeContext);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const updateIngredient = (
        id: number,
        key: keyof Omit<Step, "id">,
        value: string
    ) => {
        setIngredients((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );
    };

    const addIngredient = () => {
        setIngredients((prev) => [...prev, { id: nextId, description: "" }]);
        setNextId((prev) => prev + 1);
    };

    const removeIngredient = (id: number) => {
        if (ingredients.length === 1) {
            return;
        }

        setIngredients((prev) => prev.filter((item) => item.id !== id));
    };

    useEffect(() => {
        console.log("Current Recipe Context Data:", recipeContext?.recipeData);
    },[])

    const isNextDisabled = !ingredients.some(
        (item) => item.description.trim().length > 0
    );

    const handlePostRecipe = async (recipePayload: any) => {
        const formdata = new FormData();
        try {
            for (const key in recipePayload) {
                if (key === "ingredients" || key === "steps") {
                    formdata.append(key, JSON.stringify(recipePayload[key]));
                } else if (key === "image" && recipePayload[key]) {
                    formdata.append("image", recipePayload[key]);
                } else {
                    formdata.append(key, recipePayload[key]);
                }
            }
            const response:any = await api.post("/recipes/addRecipe", formdata,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.statusCode === 200) {
                console.log("Recipe posted successfully:", response.data);
            } else {
                console.error("Failed to post recipe:", response.statusCode, response.data);
                setMessage("Failed to post recipe. Please try again.");
            }
            return response.data
        } catch (err) {
            console.error("Error posting recipe:", err);
            setMessage("An error occurred while posting the recipe. Please try again.");
        }
    }

    const onPressNext = async() => {
        setLoading(true);
        try {
            const recipePayload = {
                ...recipeContext?.recipeData,
                steps: ingredients.map(({ description }) => ({ description })),
            };

            recipeContext?.setRecipeData(recipePayload);
            console.log("Recipe Payload Data:", recipePayload);
            const response = await handlePostRecipe(recipePayload);
            console.log("API Response:", response);
            router.replace("/social");          
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "An unknown error occurred during validation.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FDFAF6] dark:bg-background-dark" edges={["bottom"]}>
                <View className="flex-1 pb-12 gap-4">
                    <KeyboardAwareScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 16, paddingBottom: 24 }}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        extraScrollHeight={10}
                        extraHeight={200}
                    >
                        {ingredients.map((item) => (
                            <View key={item.id} className="mb-2 flex-row items-center gap-2">
                                <TextInput
                                    value={item.description}
                                    onChangeText={(value) => updateIngredient(item.id, "description", value)}
                                    placeholder="Breakdown on how to make the recipe into steps..."
                                    placeholderTextColor={isDark ? "#9CA3AF" : "#B8BEC9"}
                                    multiline
                                    textAlignVertical="top"
                                    className="h-24 flex-1 rounded-xl border border-gray-200 dark:border-surface-darker bg-white dark:bg-surface-dark px-4 py-3 font-brsegma-500 text-gray-700 dark:text-secondary-400"
                                />
                                <TouchableOpacity
                                    onPress={() => removeIngredient(item.id)}
                                    className="h-11 w-8 items-center justify-center"
                                    accessibilityRole="button"
                                    accessibilityLabel="Remove ingredient"
                                >
                                    <Ionicons
                                        name="close"
                                        size={20}
                                        color={ingredients.length === 1 ? (isDark ? "#4B5563" : "#C5C5C5") : (isDark ? "#F87171" : "#8E1207")}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            onPress={addIngredient}
                            className="mt-3 h-8 w-8 self-center rounded-full bg-primary-500 dark:bg-primary-600 items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel="Add ingredient"
                        >
                            <Ionicons name="add" size={20} color={isDark ? "#FFF9E7" : "#FFFFFF"} />
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                    {message ? (
                        <Text className="text-red-700 dark:text-red-500 text-center font-brsegma-500 mb-2">{message}</Text>
                    ) : null}
                    <TouchableOpacity
                        disabled={isNextDisabled}
                        className={`self-center rounded-full px-10 py-4 ${
                            isNextDisabled ? "bg-gray-300 dark:bg-gray-700" : "bg-primary-500 dark:bg-primary-600"
                        }`}
                        onPress={onPressNext}
                    >
                        {loading ? (
                            <>
                            <ActivityIndicator size="small" color="#FFF0C4" style={{ marginRight: 8 }} />
                            </>
                        ) : (
                            <Text className="text-center font-brsegma-600 text-secondary-400">
                                Finish
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
};

export default Steps;