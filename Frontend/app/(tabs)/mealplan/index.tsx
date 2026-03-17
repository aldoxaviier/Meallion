import {View, Text, TouchableHighlight, TouchableOpacity, FlatList, ScrollView, Image} from 'react-native';
import {api} from '../../utils/api';
import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { format, addDays, startOfToday, eachDayOfInterval, subDays } from 'date-fns';
import { ProfileDataContext } from '@/app/store/profileDataContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MealSection = ({ title, type, data, onAdd } : { title: string, type: string, data: any[], onAdd: () => void }) => {
  const filteredMeals = data.filter((meal) => meal.meal_time === type);

  return (
    <View className="bg-white rounded-3xl p-5 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-brsegma-600">{title}</Text>
        <TouchableOpacity className="px-4 py-2 rounded-full bg-primary-500" onPress={onAdd}>
          <Text className="text-sm font-semibold text-white">+ Add</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 flex flex-col gap-3">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal: any, index: number) => (
            <View key={index} className="flex-row items-center bg-secondary-400 rounded-2xl p-3">
              <Image className="w-14 h-14 rounded-2xl" source={{ uri: meal.recipes.Images }} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold text-black" numberOfLines={1}>
                  {meal.recipes.name || 'Unknown Meal'}
                </Text>
                <Text className="text-xs text-gray-500">
                  {meal.recipes.Calories} kcal · {meal.recipes.TotalTime || '0 mins'}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-[10px] text-gray-500">{meal.recipes.CarbohydrateContent}g carbs</Text>
                  <Text className="text-[10px] text-gray-500 ml-2">{meal.recipes.FatContent}g fats</Text>
                  <Text className="text-[10px] text-gray-500 ml-2">{meal.recipes.ProteinContent}g prot</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity className="p-2 rounded-full bg-white mr-2">
                  <Ionicons name="pencil-outline" size={12} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-full bg-white">
                  <Ionicons name="trash-outline" size={12} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center mt-2">
            <Text className="text-sm text-gray-400">+ Add your meal</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function mealPlan() {
  const router = useRouter();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [mealPlanData, setMealPlanData] = useState<any>({
    mealPlanData: [],
    progressMeal: []
  });
  const flatListRef = useRef<FlatList<Date>>(null);
  const profileData = useContext(ProfileDataContext);

  const dates = eachDayOfInterval({
    start: subDays(today, 7),
    end: addDays(today, 7),
  });

  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
      const timeout = setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: 7,
            animated: true
          });
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [])
  );

  useEffect(() => {
    const getMealPlan = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await api.get(`/recipes/getMealPlan?date=${formattedDate}`)
        if(response.data){
          setMealPlanData({
            mealPlanData: response.data.mealPlanData || [],
            progressMeal: response.data.progressMeal || []
          });
        }
      } catch (error) {
        console.error("Error getting meal plan data: ", error)
      }
    }
    getMealPlan()
  }, [selectedDate])
  
  const handleDatePress = (item: Date, index: number) => {
    setSelectedDate(item); 
    
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true
    });
  };

  const renderItem = ({ item, index }: {item: Date; index: number}) => {
    const isSelected = format(item, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    
    return (
      <TouchableOpacity
        onPress={() => handleDatePress(item, index)}
        className={`mr-3 w-16 h-24 rounded-2xl items-center justify-center ${
          isSelected ? 'bg-primary-400' : 'bg-white'
        }`}
      >
        <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
          {format(item, 'EEE')} 
        </Text>
        <Text className={`text-2xl font-bold mt-1 ${isSelected ? 'text-white' : 'text-black'}`}>
          {format(item, 'dd')}
        </Text>
      </TouchableOpacity>
    );
  };

  return(
    <SafeAreaView className='bg-secondary-400'>
      <ScrollView 
        className='h-full w-full px-6 pt-7'
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-4xl text-primary-500 font-fogsta">
          My Plan
        </Text>
        <View className='h-24 mt-6'>
          <FlatList
            ref={flatListRef}
            data={dates}
            renderItem={renderItem}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={7}
            getItemLayout={(data, index) => ({
              length: 44, 
              offset: 44 * index,
              index,
            })}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
        </View>
        
        <View className="bg-secondary-200 rounded-3xl p-6 mt-6">
          <View className="items-center mt-6">
            <View className="w-44 h-44 rounded-full border-8 border-gray-200 items-center justify-center">
              <Text className="text-5xl font-fogsta">{mealPlanData?.progressMeal?.progress_cal || 0}</Text>
              <Text className="text-xs text-gray-500">kcal left of {profileData?.profileData?.target_calories}</Text>
            </View>
          </View>

          <View className="mt-6 flex-row justify-between">
            <View className="items-center">
              <View className="w-16 h-2 rounded-full bg-primary-500" />
              <Text className="text-xs font-semibold text-black mt-2">Protein</Text>
              <Text className="text-xs text-gray-500">{mealPlanData?.progressMeal?.progress_pro || 0}/{profileData?.profileData?.target_proteins}g</Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-2 rounded-full bg-amber-500" />
              <Text className="text-xs font-semibold text-black mt-2">Carbs</Text>
              <Text className="text-xs text-gray-500">{mealPlanData?.progressMeal?.progress_carbs || 0}/{profileData?.profileData?.target_carbs}g</Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold text-black mt-2">Fat</Text>
              <Text className="text-xs text-gray-500">{mealPlanData?.progressMeal?.progress_fat || 0}/{profileData?.profileData?.target_fats}g</Text>
            </View>
          </View>
        </View>

        {/* Meals */}
        <View className="mt-6">
          <MealSection 
            title="Breakfast" 
            type="breakfast" 
            data={mealPlanData.mealPlanData} 
            onAdd={() => router.push({ pathname: '/mealplan/likes', params: { mealType: 'breakfast', selectedDate: format(selectedDate, 'yyyy-MM-dd') } })}
          />
          <MealSection 
            title="Lunch" 
            type="lunch" 
            data={mealPlanData.mealPlanData} 
            onAdd={() => router.push({ pathname: '/mealplan/likes', params: { mealType: 'lunch', selectedDate: format(selectedDate, 'yyyy-MM-dd') } })}
          />
          <MealSection 
            title="Snack" 
            type="snack" 
            data={mealPlanData.mealPlanData} 
            onAdd={() => router.push({ pathname: '/mealplan/likes', params: { mealType: 'snack', selectedDate: format(selectedDate, 'yyyy-MM-dd') } })}
          />
          <MealSection 
            title="Dinner" 
            type="dinner" 
            data={mealPlanData.mealPlanData} 
            onAdd={() => router.push({ pathname: '/mealplan/likes', params: { mealType: 'dinner', selectedDate: format(selectedDate, 'yyyy-MM-dd') } })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}