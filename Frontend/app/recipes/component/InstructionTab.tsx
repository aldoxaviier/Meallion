import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InstructionsTab({ recipeData }: { recipeData: any }) {
  
  const quantities = recipeData?.RecipeIngredientQuantities?.split(', ') || [];
  const parts = recipeData?.RecipeIngredientParts?.split(', ') || [];
  
  const steps = recipeData?.RecipeInstructions?.split(', ') || [];

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      
      <View className="flex-row items-center mb-4">
        <Ionicons name="restaurant-outline" size={22} color="#311004" />
        <Text className="font-brsegma-600 text-lg ml-3 text-[#311004]">Ingredients</Text>
      </View>

      <View className="pb-6 border-b border-gray-400">
        {parts.map((item: string, index: number) => (
          <View key={index} className="flex-row items-start mb-3 px-1">
            <Text className="text-primary-400 mr-2 text-lg leading-5">•</Text>
            <Text className="font-brsegma-500 text-[15px] leading-5">
              {quantities[index] ? `${quantities[index]} ` : ''}{item}
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
              <View className="w-full h-8 rounded-full items-center flex-row">
                <Text className="text-primary-400 font-bold text-l">{index + 1}</Text>
                <Text className="font-brsegma-500 text-[15px] ml-3">
                  {step}
                </Text>
              </View>

            </View>
          );
        })}
      </View>
      
    </View>
  );
}