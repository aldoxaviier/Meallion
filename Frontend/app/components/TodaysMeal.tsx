import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useContext, useEffect, useCallback, useState } from "react";
import { TenRecipeContext } from "../store/tenRecipeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { api } from "../utils/api";
import { startOfToday, format } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { current } from "@reduxjs/toolkit";
import { useColorScheme } from "nativewind";

interface MealItemProps {
  name: string;
  protein?: number;
  fat?: number;
  carbs?: number;
  calories?: number;
  image?: string;
}

const MealItem = ({ name, protein, fat, carbs, calories, image }: MealItemProps) => {
  return (
    <View className="flex-row items-center bg-secondary-200 dark:bg-surface-darker rounded-2xl py-3 px-3 mb-2">
      <Image
        source={image ? { uri: image } : require("../../assets/images/android-icon-background.png")}
        className="w-14 h-14 rounded-xl"
      />
      <View className="flex-1 ml-3">
        <Text className="font-brsegma-600 text-primary-500 dark:text-secondary-400 text-sm">{name}</Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400 font-brsegma-500">
          P:{protein}g  •  F:{fat}g  •  C:{carbs}g
        </Text>
      </View>
      <View className="bg-secondary-400 dark:bg-primary-600 px-2 py-1 rounded-lg">
        <Text className="text-xs font-brsegma-600 text-primary-500 dark:text-secondary-400">{calories} kcal</Text>
      </View>
    </View>
  );
};

export const TodaysMeal = () => {
  const today = startOfToday();
  const formattedDate = format(today, 'yyyy-MM-dd');

  const [todaysMeals, setTodaysMeals] = useState<any[]>([]);
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const mealSequence = [
    { id: 'breakfast',  icon: 'sun' },
    { id: 'lunch', icon: 'utensils' },
    { id: 'snack',  icon: 'cookie' },
    { id: 'dinner', icon: 'moon' },
  ];
  const isFinished = currentMealIndex >= mealSequence.length;
  const currentMealInfo = isFinished ? null : mealSequence[currentMealIndex];
  const currentMeals = isFinished ? [] : todaysMeals?.filter(
    (meal) => meal.meal_time === currentMealInfo?.id && meal.is_eaten === false
  );
  const currentTotalCalories = currentMeals.reduce(
    (sum, meal) => sum + (meal.Calories || 0), 0
  );

  const handleMealAction = async (actionType: string) => {
    if (actionType === 'ate') {
      setIsLoading(true);
      
      const mealIDs = currentMeals.map((meal) => meal.id);
      const progress_cal = currentMeals.reduce((sum, meal) => sum + (meal.Calories > 1000 ? meal.Calories / meal.RecipeServings : meal.Calories || 0), 0);
      const progress_pro = currentMeals.reduce((sum, meal) => sum + (meal.ProteinContent > 1000 ? meal.ProteinContent / meal.RecipeServings : meal.ProteinContent || 0), 0);
      const progress_fat = currentMeals.reduce((sum, meal) => sum + (meal.FatContent > 1000 ? meal.FatContent / meal.RecipeServings : meal.FatContent || 0), 0);
      const progress_carbs = currentMeals.reduce((sum, meal) => sum + (meal.CarbohydrateContent > 1000 ? meal.CarbohydrateContent / meal.RecipeServings : meal.CarbohydrateContent || 0), 0);
      
      try {
        const body = {
          mealIDs,
          date: formattedDate,
          progress_cal: Math.round(progress_cal),
          progress_pro: Math.round(progress_pro),
          progress_fat: Math.round(progress_fat),
          progress_carbs: Math.round(progress_carbs)
        }; 
        await api.post("/recipes/updateMealProgress", body);
        
        setCurrentMealIndex((prev) => prev + 1);
      } catch (error) {
        console.error("Gagal update meal:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentMealIndex((prev) => prev + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getTodaysMeal = async () => {
        try {
          const response = await api.get(`/recipes/getMealPlan?date=${formattedDate}`);
          const fetchedMeals = response.data.mealPlanData || [];
          
          setTodaysMeals(fetchedMeals);
          let startingIndex = 0;

          for (let i = 0; i < mealSequence.length; i++) {
            const currentSessionId = mealSequence[i].id;
            const sessionMeals = fetchedMeals.filter((meal: any) => meal.meal_time === currentSessionId);
            const isSessionCompleted = sessionMeals.length > 0 && sessionMeals.every((meal: any) => meal.is_eaten === true);

            if (isSessionCompleted) startingIndex = i + 1;
            else break; 
          }
          setCurrentMealIndex(startingIndex);
        } catch (error) {
          console.error(error);
        }
      };
      getTodaysMeal();
      return () => {};
    }, [formattedDate])
  );

  return (
    <View className="px-6 gap-3">
      <Text className="text-xl font-fogsta text-black dark:text-secondary-400">Today's meal</Text>
      {isFinished ? (
        <View className="bg-primary-600 dark:bg-surface-dark rounded-3xl p-6 items-center justify-center border border-transparent dark:border-surface-darker">
          <FontAwesome5 name="check-circle" size={40} color={isDark ? "#FFF9E7" : "#4a2c2a"} className="mb-3" />
          <Text className="text-secondary-500 dark:text-secondary-400 font-fogsta text-xl text-center">
            All meals completed!
          </Text>
        </View>
      ) : (
      <View className="bg-primary-600 dark:bg-surface-dark rounded-3xl p-4 overflow-hidden border border-transparent dark:border-surface-darker">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-yellow-400 rounded-full p-1.5">
              <FontAwesome5 name={currentMealInfo?.icon || 'sun'} size={14} color="#4a2c2a" />
            </View>
            <Text className="text-secondary-500 dark:text-secondary-400 font-fogsta text-xl uppercase">{currentMealInfo?.id}</Text>
          </View>
          <View className="bg-secondary-500 dark:bg-surface-darker px-3 py-1 rounded-md">
            <Text className="text-primary-500 dark:text-secondary-400 text-xs font-brsegma-600">{Math.round(currentTotalCalories)} kcal</Text>
          </View>
        </View>

        <View>
          {currentMeals.length > 0 ? (
            currentMeals.map((meal: any, index: number) => (
              <MealItem
                key={index}
                name={meal.name || "Unknown"}
                protein={Math.round((meal.ProteinContent || 0))}
                fat={Math.round((meal.FatContent || 0))}
                carbs={Math.round((meal.CarbohydrateContent || 0))}
                calories={Math.round((meal.Calories || 0))}
                image={meal.Images}
              />
            ))
          ) : (
            <Text className="text-secondary-500 dark:text-secondary-400 font-brsegma-500">No meals planned for this time.</Text>
          )}
        </View>

        <View className="flex-row justify-end gap-3 mt-2">
          <TouchableOpacity 
            className={` ${ isLoading || currentMeals.length === 0 ? 'bg-gray-300 dark:bg-gray-700' : 'bg-secondary-400 dark:bg-primary-500'} px-6 py-2 rounded-lg`}
            activeOpacity={0.8}
            disabled={isLoading || currentMeals.length === 0}
            onPress={() => handleMealAction('ate')}
          >
            {isLoading ? (
                <ActivityIndicator size="small" color={isDark ? "#FFF9E7" : "#4a2c2a"} />
              ) : (
                <Text className="text-primary-500 dark:text-secondary-400 font-brsegma-600 text-sm">ATE</Text>
          )}
          </TouchableOpacity>
          <TouchableOpacity 
            className={`${ isLoading ? 'bg-gray-300 dark:bg-gray-700' : 'bg-white dark:bg-surface-darker'} px-4 py-2 rounded-lg`}
            activeOpacity={0.8}
            disabled={isLoading}
            onPress={() => handleMealAction('skipped')}
          >
            <Text className="text-black dark:text-secondary-400 font-brsegma-600 text-sm">SKIPPED</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </View>
  );
};