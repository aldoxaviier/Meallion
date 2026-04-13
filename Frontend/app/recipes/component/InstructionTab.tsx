import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';

export default function InstructionsTab({ recipeData }: { recipeData: any }) {
  
  const [ingredients, setIngredients] = useState<any[]>([]);

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
    <View className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5">
      
      <View className="flex-row items-center mb-4">
        <Ionicons name="restaurant-outline" size={22} color="#311004" />
        <Text className="font-brsegma-600 text-lg ml-3 text-[#311004]">Ingredients</Text>
      </View>

      <View className="pb-6 border-b border-gray-100">
        {ingredients.map((item: any, index: number) => (
          <View key={index} className="flex-row items-start mb-4 px-1">
            <Text className="text-orange-400 mr-3 text-lg leading-5">•</Text>
            <Text className="font-brsegma-300 text-gray-900 text-sm leading-6 flex-1">
              <Text className="font-brsegma-600 text-black">
                {item.quantity != null ? `${Math.round(item.quantity * 10) / 10} ${item.unit || ''}   ` : ''}
              </Text>
              {item.original_name}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center mt-6 mb-6">
        <Ionicons name="list-outline" size={24} color="primary-600" />
        <Text className="font-brsegma-600 text-lg ml-3">Instructions</Text>
      </View>

      <View>
        {steps.map((step: string, index: number) => {
           return (
            <View key={index} className="flex-row mb-6 items-start">
              <View className="w-full h-full rounded-full items-center flex-row">
                <View className="w-6 h-6 rounded-full bg-orange-50 items-center justify-center mt-0.5">
                  <Text className="text-orange-500 font-brsegma-600 text-xs">{index + 1}</Text>
                </View>
                <Text className="font-brsegma-300 text-gray-900 text-sm leading-6 ml-4 flex-1">
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