import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useCallback, useEffect, useRef,useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PreferenceCard, { PreferenceCardRef } from "../components/PreferenceCard";
import api from "../utils/api";
import { ProfileContext } from "../store/profileContext";

const { width } = Dimensions.get("window");

const Preference = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const [dislikedRecipes, setDislikedRecipes] = useState<number[]>([]);
  const cardRefs = useRef<Map<number, PreferenceCardRef>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const handleSwipeRight = (id: number) => {
    setLikedRecipes((prev) => [...prev, id]);
    setRecipes((prev) => prev.filter((recipe) => recipe.recipe_id !== id));
    console.log("Liked recipe:", id);
  }

  const handleSwipeLeft = (id: number) => {
    setDislikedRecipes((prev) => [...prev, id]);
    setRecipes((prev) => prev.filter((recipe) => recipe.recipe_id !== id));
    console.log("Disliked recipe:", id);
  }

  const handleButtonSwipeLeft = () => {
    if (recipes.length > 0) {
      const topCard = recipes[recipes.length - 1];
      const cardRef = cardRefs.current.get(topCard.recipe_id);
      cardRef?.swipeLeft();
    }
  }

  const handleButtonSwipeRight = () => {
    if (recipes.length > 0) {
      const topCard = recipes[recipes.length - 1];
      const cardRef = cardRefs.current.get(topCard.recipe_id);
      cardRef?.swipeRight();
    }
  }

  const fetch10recipes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/recipes/get10recipes');
      setRecipes(response.data.data.recipes);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setIsLoading(false);
    }
  }

  const submitinteractions = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/user/submitRecipeInteractions', {
        likedRecipes: likedRecipes,
        dislikedRecipes: dislikedRecipes
      });
      setIsLoading(false);
    } catch (err) {
      
    }
  }

  useEffect(() => {
    fetch10recipes();
  }, []);

  useEffect(() => {
    if(recipes.length === 0 && !isLoading){
      
    } 
    console.log("Recipes left:", recipes.length);
  },[recipes]);

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
              recipes.map((recipe, index) => (
                <PreferenceCard
                  key={recipe.recipe_id}
                  ref={(ref) => {
                    if (ref) {
                      cardRefs.current.set(recipe.recipe_id, ref);
                    } else {
                      cardRefs.current.delete(recipe.recipe_id);
                    }
                  }}
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
            <TouchableOpacity onPress={handleButtonSwipeLeft}>
              <View className="items-center">
                <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center">
                  <Feather name="x" size={28} color="#F44336" />
                </View>
                <Text className="text-xs text-gray-500 mt-1">Swipe Left</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleButtonSwipeRight}>
              <View className="items-center">
                <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center">
                  <Feather name="heart" size={28} color="#4CAF50" />
                </View>
                <Text className="text-xs text-gray-500 mt-1">Swipe Right</Text>
              </View>
            </TouchableOpacity>
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