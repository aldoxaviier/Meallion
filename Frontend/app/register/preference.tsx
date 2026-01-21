import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PreferenceCard from "../components/PreferenceCard";
import api from "../utils/api";

const { width } = Dimensions.get("window");

const Preference = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const [dislikedRecipes, setDislikedRecipes] = useState<number[]>([]);

  const handleSwipeRight = useCallback((id: number) => {
    setLikedRecipes((prev) => [...prev, id]);
    // setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    console.log("Liked recipe:", id);
  }, []);

  const handleSwipeLeft = useCallback((id: number) => {
    setDislikedRecipes((prev) => [...prev, id]);
    // setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    console.log("Disliked recipe:", id);
  }, []);

  const fetch10recipes = async () => {
    try {
      const response = await api.get('/recipes/get10recipes');
      console.log("Fetched recipes:", response.data.data.recipes[0]);
      setRecipes(response.data.data.recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  }

  useEffect(() => {
    fetch10recipes();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-secondary-400 flex-1">
        <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
          {/* Header */}
          <TouchableOpacity
            className="self-start pr-2 py-2 rounded-lg"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View className="flex flex-row gap-1 mb-2">
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
            <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
          </View>

          {/* Title & Stats */}
          <View className="items-center mb-2">
            <Text className="text-4xl font-fogsta text-primary-500 text-center">
                Discover your taste
            </Text>
          </View>

          {/* Cards Container */}
          <View style={styles.cardsContainer}>
            {recipes.length > 0 ? (
              // Render cards in reverse order so first card is on top
              recipes.map((recipe, index) => (
                <PreferenceCard
                  key={recipe.recipe_id}
                  data={recipe}
                  index={recipes.length - 1 - index}
                  totalCards={recipes.length}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text className="text-2xl font-brsegma-600 text-primary-500 text-center">
                  🎉 All Done!
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  You've swiped through all recipes
                </Text>
                <Text className="text-gray-600 text-center mt-4">
                  Liked: {likedRecipes.length} recipes
                </Text>
              </View>
            )}
          </View>

          {/* Swipe Instructions */}
          <View className="flex-row justify-center items-center gap-8 mb-4">
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center">
                <Feather name="x" size={28} color="#F44336" />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Swipe Left</Text>
            </View>
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center">
                <Feather name="heart" size={28} color="#4CAF50" />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Swipe Right</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
});

export default Preference;