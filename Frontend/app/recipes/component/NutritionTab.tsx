import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function NutritionTab({ recipeData }: { recipeData: any} ) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const nutrients = [
    { label: 'Carbs', value: recipeData?.CarbohydrateContent, unit: 'g', color: '#DED066' },
    { label: 'Protein', value: recipeData?.ProteinContent, unit: 'g', color: '#FF5A5F' },
    { label: 'Fiber', value: recipeData?.FiberContent, unit: 'g', color: '#FF9F1C' },
    { label: 'Sugar', value: recipeData?.SugarContent, unit: 'g', color: '#33A1FD', border: true },
    { label: 'Sodium', value: recipeData?.SodiumContent, unit: 'mg', color: '#3F8CFF' },
    { label: 'Fat', value: recipeData?.FatContent, unit: 'g', color: '#40C9A2' },
    { label: 'Saturated fat', value: recipeData?.SaturatedFatContent, unit: 'g', color: '#5E4AE3', border: true },
    { label: 'Cholesterol', value: recipeData?.CholesterolContent, unit: 'mg', color: '#A07A6D' },
  ];

  return (
    <View>
      <View className="flex flex-row bg-primary-500 dark:bg-surface-dark rounded-2xl py-6 px-9 justify-between items-center shadow-lg border border-transparent dark:border-surface-darker">
        <View>
          <Text className="text-white dark:text-secondary-400 font-brsegma-600">Total Calories</Text>
          <View className="flex flex-row items-baseline">
            <Text className="text-white dark:text-secondary-400 text-[56px] font-fogsta">{recipeData.Calories}</Text>
            <Text className="text-white dark:text-secondary-400 text-base ml-2 font-brsegma-600">kcal</Text>
          </View>
          <Text className="text-white/80 dark:text-secondary-400/80 text-[14px] mt-1 font-brsegma-500">per serving</Text>
        </View>
        <View className="bg-white/20 dark:bg-black/20 w-[70px] h-[70px] rounded-full justify-center items-center">
          <Ionicons name="flame" size={36} color={isDark ? "#eddca1" : "white"} />
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-[20px] font-brsegma-600 text-[#311004] dark:text-secondary-400 mb-4 ml-2">
          Micronutrients
        </Text>
        <View className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-transparent dark:border-surface-darker" style={{ elevation: 2 }}>
          {nutrients.map((item, index) => (
            <View 
              key={index} 
              className={`flex-row justify-between items-center py-3 ${item.border ? 'border-b border-gray-100 dark:border-surface-darker mb-2' : ''}`}
            >
              <View className="flex-row items-center">
                <View style={{ backgroundColor: item.color }} className="w-[10px] h-[10px] rounded-full mr-3" />
                <Text className="text-gray-600 dark:text-gray-400 text-sm font-brsegma-500">{item.label}</Text>
              </View>
              <Text className="text-gray-900 dark:text-secondary-400 text-sm font-brsegma-600">
                {item.value || "0"} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};