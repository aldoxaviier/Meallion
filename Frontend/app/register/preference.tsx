import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PreferenceCard, { RecipeData } from "../components/PreferenceCard";

const { width } = Dimensions.get("window");

// Dummy data - 10 resep makanan
const DUMMY_RECIPES: RecipeData[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800",
    calories: 450,
    cookTime: "20 min",
    category: "Indonesian",
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    calories: 320,
    cookTime: "15 min",
    category: "Salad",
  },
  {
    id: 3,
    name: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    calories: 580,
    cookTime: "25 min",
    category: "Italian",
  },
  {
    id: 4,
    name: "Sushi Roll Platter",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
    calories: 380,
    cookTime: "40 min",
    category: "Japanese",
  },
  {
    id: 5,
    name: "Beef Burger Deluxe",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    calories: 720,
    cookTime: "30 min",
    category: "American",
  },
  {
    id: 6,
    name: "Pad Thai",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    calories: 490,
    cookTime: "25 min",
    category: "Thai",
  },
  {
    id: 7,
    name: "Rendang Daging",
    image: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800",
    calories: 550,
    cookTime: "120 min",
    category: "Indonesian",
  },
  {
    id: 8,
    name: "Grilled Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    calories: 420,
    cookTime: "20 min",
    category: "Seafood",
  },
  {
    id: 9,
    name: "Tacos al Pastor",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    calories: 380,
    cookTime: "35 min",
    category: "Mexican",
  },
  {
    id: 10,
    name: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800",
    calories: 280,
    cookTime: "10 min",
    category: "Breakfast",
  },
];

const Preference = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeData[]>(DUMMY_RECIPES);
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const [dislikedRecipes, setDislikedRecipes] = useState<number[]>([]);

  const handleSwipeRight = useCallback((id: number) => {
    setLikedRecipes((prev) => [...prev, id]);
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    console.log("Liked recipe:", id);
  }, []);

  const handleSwipeLeft = useCallback((id: number) => {
    setDislikedRecipes((prev) => [...prev, id]);
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    console.log("Disliked recipe:", id);
  }, []);

  const remainingCards = recipes.length;
  const progress = ((DUMMY_RECIPES.length - remainingCards) / DUMMY_RECIPES.length) * 100;

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
              [...recipes].reverse().map((recipe, index) => (
                <PreferenceCard
                  key={recipe.id}
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