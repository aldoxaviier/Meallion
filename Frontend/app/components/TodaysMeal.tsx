import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useContext } from "react";
import { TenRecipeContext } from "../store/tenRecipeContext";
import { FontAwesome5 } from "@expo/vector-icons";

interface MealItemProps {
  name: string;
  protein?: number;
  fat?: number;
  carbs?: number;
  calories?: number;
  image?: string;
}

const MealItem = ({ name, protein = 20, fat = 50, carbs = 67, calories = 130, image }: MealItemProps) => {
  return (
    <View className="flex-row items-center bg-secondary-200 rounded-2xl py-3 px-3 mb-2">
      <Image
        source={image ? { uri: image } : require("../../assets/images/android-icon-background.png")}
        className="w-14 h-14 rounded-xl"
      />
      <View className="flex-1 ml-3">
        <Text className="font-brsegma-600 text-primary-500 text-sm">{name}</Text>
        <Text className="text-xs text-gray-600 font-brsegma-400">
          P:{protein}g  •  F:{fat}g  •  C:{carbs}g
        </Text>
      </View>
      <View className="bg-secondary-400 px-2 py-1 rounded-lg">
        <Text className="text-xs font-brsegma-600 text-primary-500">{calories} kcal</Text>
      </View>
    </View>
  );
};

export const TodaysMeal = () => {
  const tenRecipe = useContext(TenRecipeContext);
  const todaysMeals = tenRecipe?.TenRecipe?.slice(0, 2) || [];
  const totalCalories = todaysMeals.reduce((acc: number, meal: any) => {
    return acc + (meal.Calories || 130);
  }, 0) || 100;

  return (
    <View className="px-6 gap-3">
      <Text className="text-xl font-fogsta">Today's meal</Text>
      
      <View className="bg-primary-600 rounded-3xl p-4 overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-yellow-400 rounded-full p-1.5">
              <FontAwesome5 name="sun" size={14} color="#4a2c2a" />
            </View>
            <Text className="text-secondary-500 font-fogsta text-xl">Breakfast</Text>
          </View>
          <View className="bg-secondary-500 px-3 py-1 rounded-md">
            <Text className="text-primary-500 text-xs font-brsegma-600">{totalCalories} kcal</Text>
          </View>
        </View>

        {/* Meal Items */}
        <View>
          {todaysMeals.length > 0 ? (
            todaysMeals.map((meal: any, index: number) => (
              <MealItem
                key={meal.recipe_id || index}
                name={meal.name || meal.Name || "Hamburg"}
                protein={Math.round((meal.ProteinContent || 20))}
                fat={Math.round((meal.FatContent || 50))}
                carbs={Math.round((meal.CarbohydrateContent || 67))}
                calories={Math.round((meal.Calories || 130))}
                image={meal.Images}
              />
            ))
          ) : (
            <>
              <MealItem name="Hamburg" protein={20} fat={50} carbs={67} calories={130} />
              <MealItem name="Hamburg" protein={41} fat={35} carbs={45} calories={150} />
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-end gap-3 mt-2">
          <TouchableOpacity 
            className="bg-secondary-400 px-6 py-2 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-primary-500 font-brsegma-600 text-sm">ATE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white px-4 py-2 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-black font-brsegma-600 text-sm">SKIPPED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
