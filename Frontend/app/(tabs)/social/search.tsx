import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "@/app/utils/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const handleFetchResults = async (searchText: string) => {
        const trimmed = searchText.trim();

        if (!trimmed) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const res: any = await api.get(
                `/recipes/getRecipesByNameCategory?query=${trimmed}&page=1&limit=20&category=&isSocial=true`
            );
            console.log("Search results:", res.data);
            setResults(res?.data || []);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleFetchResults(query);
        }, 2000);

        return () => clearTimeout(timer);
    }, [query]);

    const getImage = (image: string | null | undefined) => {
        if (!image) return null;
        if (image.startsWith("http")) return image;
        return `${baseUrl}/${image}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-secondary-400">
        <View className="flex-1 bg-secondary-400 px-4 pt-4">
            <View className="flex-row items-center gap-3">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-11 w-11 items-center justify-center "
                    activeOpacity={0.8}
                >
                    <Entypo name="chevron-left" size={24} color="#111827" />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center rounded-xl bg-white px-4">
                    <Ionicons name="search" size={18} color="#6B7280" />
                    <TextInput
                        className="ml-2 flex-1 text-base text-gray-800"
                        placeholder="Search social recipes..."
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4a2c2a" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => String(item.recipe_id)}
                    contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <View className="items-center pt-16">
                            <Text className="text-gray-600 font-brsegma-500">
                                {query.trim() ? "No recipes found" : "Start typing to search"}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const imageUri = getImage(item.Images);

                        return (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => router.push(`../recipes/${item.recipe_id}`)}
                                className="flex-row items-center gap-3 rounded-2xl bg-white p-3"
                            >
                                <Image
                                    source={
                                        imageUri
                                            ? { uri: imageUri }
                                            : require("../../../assets/images/android-icon-background.png")
                                    }
                                    className="h-16 w-16 rounded-xl"
                                />
                                <View className="flex-1">
                                    <Text className="font-brsegma-600 text-base text-gray-800" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text className="font-brsegma-500 text-sm text-gray-500" numberOfLines={2}>
                                        {item.Description || "No description"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
        </SafeAreaView>
    );
}