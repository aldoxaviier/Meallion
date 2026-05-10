import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { useColorScheme } from 'nativewind';

export default function InstructionsTab({ recipeData }: { recipeData: any }) {
  
  const [ingredients, setIngredients] = useState<any[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await api.get(`/recipes/getRecIngByRecipeId?recipeId=${recipeData?.recipe_id}`);
        
        if (response?.data) {
          setIngredients(response.data);
        }
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
    if (recipeData?.recipe_id) {
      fetchIngredients();
    }
  }, []);
  
  const steps = recipeData?.RecipeInstructions?.split('., ') || [];

  return (
    <View className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm shadow-black/5 border border-transparent dark:border-surface-darker">
      
      <View className="flex-row items-center mb-4">
        <Ionicons name="restaurant-outline" size={22} color={isDark ? "#FFF9E7" : "#311004"} />
        <Text className="font-brsegma-600 text-lg ml-3 text-[#311004] dark:text-secondary-400">Ingredients</Text>
      </View>

      <View className="pb-6 border-b border-gray-100 dark:border-surface-darker">
        {ingredients.map((item: any, index: number) => (
          <View key={index} className="flex-row items-start mb-4 px-1">
            <Text className="text-orange-400 mr-3 text-lg leading-5">•</Text>
            <Text className="font-brsegma-300 text-gray-900 dark:text-secondary-400 text-sm leading-6 flex-1">
              <Text className="font-brsegma-600 text-black dark:text-secondary-400">
                {item.quantity != null ? `${Math.round(item.quantity * 10) / 10} ${item.unit || ''}   ` : ''}
              </Text>
              {item.original_name}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center mt-6 mb-6">
        {/* Fixed Inconsistency: Ionicons color prop doesn't accept tailwind classes like "primary-600" */}
        <Ionicons name="list-outline" size={24} color={isDark ? "#FFF9E7" : "#3E0703"} />
        <Text className="font-brsegma-600 text-lg ml-3 text-[#311004] dark:text-secondary-400">Instructions</Text>
      </View>

      <View>
        {steps.map((step: string, index: number) => {
           return (
            <View key={index} className="flex-row mb-6 items-start">
              <View className="w-full h-full rounded-full items-center flex-row">
                <View className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-900/30 items-center justify-center mt-0.5">
                  <Text className="text-orange-500 dark:text-orange-400 font-brsegma-600 text-xs">{index + 1}</Text>
                </View>
                <Text className="font-brsegma-300 text-gray-900 dark:text-secondary-400 text-sm leading-6 ml-4 flex-1">
                  {step.trim()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      
    </View>
  );
}