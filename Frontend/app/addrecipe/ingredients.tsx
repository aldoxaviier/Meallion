import { Ionicons } from "@expo/vector-icons";
import { useContext, useState, useRef, useEffect } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RecipeContext } from "../store/addRecipeContext";
import { router } from "expo-router";
import { api } from "../utils/api";

type Ingredient = {
    id: number;
    name: string;
    qty: string;
};

type IngredientSuggestion = {
    original_name: string;
    [key: string]: any;
};

const Ingredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: 1, name: "", qty: "" },
    ]);
    const [nextId, setNextId] = useState(3);
    const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
    const [activeInputId, setActiveInputId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const recipeContext = useContext(RecipeContext);
    const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout);
        };
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await api.get(`/recipes/getIngredients?query=${query}`);
            setSuggestions(response.data);
        } catch (error) {
            setSuggestions([]);
        }
    };

    const updateIngredient = (
        id: number,
        key: keyof Omit<Ingredient, "id">,
        value: string
    ) => {
        setIngredients((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );

        if (key === "name") {
            setActiveInputId(id);
            setSuggestions([]);

            if (debounceTimers.current[id]) {
                clearTimeout(debounceTimers.current[id]);
            }

            debounceTimers.current[id] = setTimeout(() => {
                fetchSuggestions(value);
            }, 2000);
        }
    };

    const selectSuggestion = (ingredientId: number, suggestion: IngredientSuggestion) => {
        setIngredients((prev) =>
            prev.map((item) =>
                item.id === ingredientId
                    ? { ...item, name: suggestion.original_name }
                    : item
            )
        );
        setSuggestions([]);
        setActiveInputId(null);

        if (debounceTimers.current[ingredientId]) {
            clearTimeout(debounceTimers.current[ingredientId]);
        }
    };

    const addIngredient = () => {
        setIngredients((prev) => [...prev, { id: nextId, name: "", qty: "" }]);
        setNextId((prev) => prev + 1);
    };

    const removeIngredient = (id: number) => {
        if (ingredients.length === 1) return;
        setIngredients((prev) => prev.filter((item) => item.id !== id));
        if (activeInputId === id) {
            setSuggestions([]);
            setActiveInputId(null);
        }
    };

    const isNextDisabled = !ingredients.some(
        (item) => item.name.trim().length > 0 && item.qty.trim().length > 0
    );

    const onPressNext = async () => {
        try {
            await recipeContext?.setRecipeData({
                ...recipeContext.recipeData,
                ingredients: ingredients.map(({ name, qty }) => ({ name, qty })),
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

                            {/* Suggestions dropdown */}
                            {activeInputId === item.id && suggestions.length > 0 && (
                                <View className="mt-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                    <FlatList
                                        data={suggestions}
                                        keyExtractor={(s, index) => `${s.original_name}-${index}`}
                                        keyboardShouldPersistTaps="handled"
                                        scrollEnabled={suggestions.length > 4}
                                        style={{ maxHeight: 160 }}
                                        renderItem={({ item: suggestion, index }) => (
                                            <TouchableOpacity
                                                onPress={() => selectSuggestion(item.id, suggestion)}
                                                className={`px-4 py-3 ${
                                                    index !== suggestions.length - 1
                                                        ? "border-b border-gray-100"
                                                        : ""
                                                }`}
                                            >
                                                <Text className="font-brsegma-500 text-gray-700">
                                                    {suggestion.original_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
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