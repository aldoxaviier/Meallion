import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { useRouter } from 'expo-router';

export default function Likes() {
  const router = useRouter();
  const { mealType, selectedDate } = useLocalSearchParams();
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);

  const refreshLikedRecipes = async () => {
    try {
      const response = await api.get(`/recipes/getLikesByUserId`);
      setLikedRecipes(response.data || []);
    } catch (err) {
      console.error('Error fetching liked meals:', err);
    }
  };

  useEffect(() => {
    refreshLikedRecipes();
  }, []);

  const handleAddToMealplan = async (recipeId: number) => {
    try {
      const body = {recipeId, mealType, date: selectedDate}
      await api.post(`/recipes/addToMealPlan`, body);
      router.back();
    } catch (err) {
      console.error('Error adding to meal plan:', err);
    }
  };

  const handleRemoveLike = async (recipeId: number) => {
    try {
      await api.delete(`/recipes/removeLikes?recipeId=${recipeId}`);
      setLikedRecipes((prev) => prev.filter((item) => item.recipes?.id !== recipeId));
      await refreshLikedRecipes();
    } catch (err) {
      console.error('Error removing like:', err);
    }
  };

  const renderFood = ({ item }: { item: any }) => {
    const recipeId = item.recipe_id ?? null;

    return (
      <View className="flex-row items-center bg-white rounded-2xl p-3 mb-2">
        <Image className="w-14 h-14 rounded-2xl" source={{ uri: item.recipes.Images }} />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-black" numberOfLines={1}>
            {item.recipes.name || 'Unknown Meal'}
          </Text>
          <Text className="text-xs text-gray-500">
            {item.recipes.Calories} kcal · {item.recipes.TotalTime || '0 mins'}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-[10px] text-gray-500">{item.recipes.CarbohydrateContent}g carbs</Text>
            <Text className="text-[10px] text-gray-500 ml-2">{item.recipes.FatContent}g fats</Text>
            <Text className="text-[10px] text-gray-500 ml-2">{item.recipes.ProteinContent}g prot</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-1.5 rounded-full mr-2 bg-emerald-50"
            onPress={() => handleAddToMealplan(recipeId)}
          >
            <Ionicons name="add-outline" size={20} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1.5 rounded-full bg-red-50"
            onPress={() => handleRemoveLike(recipeId)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-secondary-400 p-5">
      <FlatList data={likedRecipes} renderItem={renderFood}/>
    </View>
  );
}