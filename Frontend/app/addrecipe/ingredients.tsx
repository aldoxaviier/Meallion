import { Ionicons } from "@expo/vector-icons";
import { useContext, useState, useRef, useEffect } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RecipeContext } from "../store/addRecipeContext";
import { router } from "expo-router";
import { api } from "../utils/api";

type IngredientSuggestion = {
    original_name: string;
    [key: string]: any;
};

const Ingredients = () => {
    const [ingredients, setIngredients] = useState<any[]>([
        { id: 1, name: "", qty: "", ingredientId: 0 },
    ]);
    const [nextId, setNextId] = useState(3);
    const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
    const [activeInputId, setActiveInputId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // 👈
    const recipeContext = useContext(RecipeContext);
    const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const loaderTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout);
            Object.values(loaderTimers.current).forEach(clearTimeout);
        };
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
            return;
        }
        try {
            const response = await api.get(`/recipes/search-ingredients?query=${query}`);
            console.log("Suggestions response:", response.data.length);
            setSuggestions(response.data);
        } catch (error) {
            setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const updateIngredient = (
        id: number,
        key: keyof Omit<any, "id">,
        value: string
    ) => {
        setIngredients((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );

        if (key === "name") {
            setActiveInputId(id);
            setSuggestions([]);

            setIngredients((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ingredientId: 0 } : item))
            );

            if (debounceTimers.current[id]) {
                clearTimeout(debounceTimers.current[id]);
            }

            if (loaderTimers.current[id]) {
                clearTimeout(loaderTimers.current[id]);
            }

            if (value.trim()) {
                loaderTimers.current[id] = setTimeout(() => {
                    setIsLoadingSuggestions(true);
                }, 500);
            }

            debounceTimers.current[id] = setTimeout(() => {
                fetchSuggestions(value);
            }, 1000);
        }
    };

    const selectSuggestion = (ingredientId: number, suggestion: IngredientSuggestion) => {
    setIngredients((prev) =>
        prev.map((item) =>
            item.id === ingredientId
                ? {
                    ...item,
                    ...suggestion,
                    ingredientId: suggestion.id,
                    name: suggestion.original_name,
                  }
                : item
        )
    );
    setSuggestions([]);
    setActiveInputId(null);
    setIsLoadingSuggestions(false);

    if (debounceTimers.current[ingredientId]) {
        clearTimeout(debounceTimers.current[ingredientId]);
    }
};

    const addIngredient = () => {
        setIngredients((prev) => [...prev, { id: nextId, name: "", qty: "", ingredientId: 0 }]); 
        setNextId((prev) => prev + 1);
    };

    const removeIngredient = (id: number) => {
        if (ingredients.length === 1) return;
        setIngredients((prev) => prev.filter((item) => item.id !== id));
        if (activeInputId === id) {
            setSuggestions([]);
            setActiveInputId(null);
            setIsLoadingSuggestions(false); // 👈
        }
    };

    const isNextDisabled = !ingredients.some(
        (item) => item.name.trim().length > 0 && item.qty.trim().length > 0
    );

    const onPressNext = async () => {
        try {
            await recipeContext?.setRecipeData({
                ...recipeContext.recipeData,
                ingredients: ingredients.map(({ id, name, ...rest }) => rest),
            });
            router.push("/addrecipe/steps");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "An unknown error occurred during validation.");
        }
    };

    return (
        <SafeAreaView className="flex-1" edges={["bottom"]}>
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
                        <View key={item.id} className="mb-2">
                            <View className="flex-row items-center gap-2">
                                <TextInput
                                    value={item.name}
                                    onChangeText={(value) => updateIngredient(item.id, "name", value)}
                                    onFocus={() => setActiveInputId(item.id)}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            if (activeInputId === item.id) {
                                                setSuggestions([]);
                                                setActiveInputId(null);
                                                setIsLoadingSuggestions(false); // 👈
                                            }
                                        }, 200);
                                    }}
                                    placeholder="Name"
                                    placeholderTextColor="#B8BEC9"
                                    className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 font-brsegma-500 text-gray-700"
                                />
                                <TextInput
                                    value={item.qty}
                                    onChangeText={(value) => updateIngredient(item.id, "qty", value)}
                                    placeholder="qty (g)"
                                    placeholderTextColor="#B8BEC9"
                                    keyboardType="number-pad"
                                    className="h-11 w-20 rounded-xl border border-gray-200 bg-white px-3 text-center font-brsegma-500 text-gray-700"
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
                                        color={ingredients.length === 1 ? "#C5C5C5" : "#8E1207"}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Loading indicator */}
                            {activeInputId === item.id && isLoadingSuggestions && ( // 👈
                                <View className="mt-1 rounded-xl border border-gray-200 bg-white px-4 py-3 items-center">
                                    <ActivityIndicator size="small" color="#8E1207" />
                                </View>
                            )}

                            {/* Suggestions dropdown */}
                            {activeInputId === item.id && !isLoadingSuggestions && suggestions.length > 0 && ( // 👈
                                <View className="mt-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                    <ScrollView
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled={true}
                                        style={{ maxHeight: 200 }}
                                    >
                                        {suggestions.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={`${suggestion.original_name}-${index}`}
                                            onPress={() => selectSuggestion(item.id, suggestion)}
                                            className={`px-4 py-3 ${
                                            index !== suggestions.length - 1 ? "border-b border-gray-100" : ""
                                            }`}
                                        >
                                            <Text className="font-brsegma-500 text-gray-700">
                                            {suggestion.original_name}
                                            </Text>
                                        </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity
                        onPress={addIngredient}
                        className="mt-3 h-8 w-8 self-center rounded-full bg-primary-500 items-center justify-center"
                        accessibilityRole="button"
                        accessibilityLabel="Add ingredient"
                    >
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

                <TouchableOpacity
                    disabled={isNextDisabled}
                    className={`self-center rounded-full px-10 py-4 ${
                        isNextDisabled ? "bg-gray-300" : "bg-primary-500"
                    }`}
                    onPress={onPressNext}
                >
                    <Text className="text-center font-brsegma-600 text-secondary-400">
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Ingredients;