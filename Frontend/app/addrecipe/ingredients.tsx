import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Ingredient = {
    id: number;
    name: string;
    qty: string;
};

const Ingredients = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: 1, name: "", qty: "" },
        { id: 2, name: "", qty: "" },
    ]);
    const [nextId, setNextId] = useState(3);

    const updateIngredient = (
        id: number,
        key: keyof Omit<Ingredient, "id">,
        value: string
    ) => {
        setIngredients((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );
    };

    const addIngredient = () => {
        setIngredients((prev) => [...prev, { id: nextId, name: "", qty: "" }]);
        setNextId((prev) => prev + 1);
    };

    const removeIngredient = (id: number) => {
        if (ingredients.length === 1) {
            return;
        }

        setIngredients((prev) => prev.filter((item) => item.id !== id));
    };

    const isNextDisabled = !ingredients.some(
        (item) => item.name.trim().length > 0 && item.qty.trim().length > 0
    );

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
                        {/* <Text className="mb-2 text-base font-brsegma-600 text-primary-500">
                            Ingredients
                        </Text> */}

                        {ingredients.map((item) => (
                            <View key={item.id} className="mb-2 flex-row items-center gap-2">
                                <TextInput
                                    value={item.name}
                                    onChangeText={(value) => updateIngredient(item.id, "name", value)}
                                    placeholder="Name"
                                    placeholderTextColor="#B8BEC9"
                                    className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 font-brsegma-500 text-gray-700"
                                />
                                <TextInput
                                    value={item.qty}
                                    onChangeText={(value) => updateIngredient(item.id, "qty", value)}
                                    placeholder="qty"
                                    placeholderTextColor="#B8BEC9"
                                    keyboardType="number-pad"
                                    className="h-11 w-14 rounded-xl border border-gray-200 bg-white px-3 text-center font-brsegma-500 text-gray-700"
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