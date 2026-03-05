import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NutritionTab({ recipeData }: { recipeData: any} ) {
  const nutrients = [
    { label: 'Carbs', value: recipeData?.CarbohydrateContent, unit: 'g', color: '#DED066' },
    { label: 'Protein', value: recipeData?.ProteinContent, unit: 'g', color: '#FF5A5F' },
    { label: 'Fiber', value: recipeData?.FiberContent, unit: 'g', color: '#FF9F1C' },
    { label: 'Sugar', value: recipeData?.SugarContent, unit: 'g', color: '#33A1FD', border: true },
    { label: 'Fat', value: recipeData?.FatContent, unit: 'g', color: '#40C9A2' },
    { label: 'Saturated fat', value: recipeData?.SaturatedFatContent, unit: 'g', color: '#5E4AE3', border: true },
    { label: 'Cholesterol', value: recipeData?.CholesterolContent, unit: 'g', color: '#A07A6D' },
  ];

  return (
    <View>
      <View className="flex flex-row bg-primary-500 rounded-2xl py-6 px-9 justify-between items-center shadow-lg">
        <View>
          <Text className="text-white font-bold">Total Calories</Text>
          <View className="flex flex-row items-baseline">
            <Text className="text-white text-[56px] font-fogsta">{recipeData.Calories}</Text>
            <Text className="text-white text-base ml-2 font-bold">kcal</Text>
          </View>
          <Text className="text-white/80 text-[14px] mt-1">per serving</Text>
        </View>
        <View className="bg-white/20 w-[70px] h-[70px] rounded-full justify-center items-center">
          <Ionicons name="flame" size={36} color="white" />
        </View>
      </View>

      {/* Micronutrients List */}
      <View className="mt-6">
        <Text className="text-[20px] font-bold text-[#311004] mb-4 ml-2">
          Micronutrients
        </Text>
        <View className="bg-white rounded-2xl p-5 shadow-sm" style={{ elevation: 2 }}>
          {nutrients.map((item, index) => (
            <View 
              key={index} 
              className={`flex-row justify-between items-center py-3 ${item.border ? 'border-b border-gray-100 mb-2' : ''}`}
            >
              <View className="flex-row items-center">
                <View style={{ backgroundColor: item.color }} className="w-[10px] h-[10px] rounded-full mr-3" />
                <Text className="text-gray-600 text-sm">{item.label}</Text>
              </View>
              <Text className="text-gray-900 text-sm font-semibold">
                {item.value || "0"} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};