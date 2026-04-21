import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfToday, eachDayOfInterval, subDays } from 'date-fns';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { api } from '../../utils/api';
import { ProfileDataContext } from '@/app/store/profileDataContext';

interface DeletePlanParams {
  mealId: string;
  date: string;
  cal: number;
  pro: number;
  fat: number;
  carbs: number;
}

interface MealSectionProps {
  title: string;
  type: string;
  data: any[];
  onAdd: () => void;
  onDelete: (meal: any) => void;
  isComplete: boolean;
  canDeleteMeals: boolean;
}

interface MacroBarProps {
  percentage: number;
  colorClass: string;
  label: string;
  current: number;
  target: number;
}

const MacroBar = ({ percentage, colorClass, label, current, target }: MacroBarProps) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View className="items-center">
      <View className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden flex-row justify-start">
        <Animated.View
          className={`h-full rounded-full ${colorClass}`}
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
      <Text className="text-xs font-semibold text-black mt-2">{label}</Text>
      <Text className="text-xs text-gray-500">{current}/{target}g</Text>
    </View>
  );
};

export default function MealPlan() {
  const router = useRouter();
  const profileData = useContext(ProfileDataContext);
  const flatListRef = useRef<FlatList<Date>>(null);
  const latestMealPlanRequestRef = useRef(0);

  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [previousSelectedDate, setPreviousSelectedDate] = useState(today);
  const [isMealPlanLoading, setIsMealPlanLoading] = useState(false);
  const [loadedMealPlanDate, setLoadedMealPlanDate] = useState<string | null>(null);
  const [mealPlanData, setMealPlanData] = useState<any>({
    mealPlanData: [],
    progressMeal: {}
  });

  const dates = eachDayOfInterval({
    start: subDays(today, 7),
    end: addDays(today, 7),
  });

  const getMealPlan = async (dateToFetch: Date) => {
    const requestId = ++latestMealPlanRequestRef.current;
    setIsMealPlanLoading(true);
    try {
      const formattedDate = format(dateToFetch, 'yyyy-MM-dd');
      const response = await api.get(`/recipes/getMealPlan?date=${formattedDate}`);
      if (requestId !== latestMealPlanRequestRef.current) return;

      if (response.data) {
        setMealPlanData({
          mealPlanData: response.data.mealPlanData || [],
          progressMeal: response.data.progressMeal || {}
        });
        setLoadedMealPlanDate(formattedDate);
      }
    } catch (error) {
      console.error("Error getting meal plan data: ", error);
    } finally {
      if (requestId === latestMealPlanRequestRef.current) {
        setIsMealPlanLoading(false);
      }
    }
  };

  const handleDeletePlan = async ({ mealId, date, cal, pro, fat, carbs }: DeletePlanParams) => {
    try {
      const body = { mealId, date, cal, pro, fat, carbs };
      await api.delete(`/recipes/deleteMealPlan`, { params: body });
      await getMealPlan(selectedDate);
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
      getMealPlan(today);

      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 7, animated: true });
      }, 100);

      return () => clearTimeout(timeout);
    }, [])
  );

  useEffect(() => {
    getMealPlan(selectedDate);
  }, [selectedDate]);

  const handleDatePress = (item: Date, index: number) => {
    setPreviousSelectedDate(selectedDate);
    setSelectedDate(item);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleAddMeal = (mealType: string) => {
    router.push({
      pathname: '/mealplan/likes',
      params: { mealType, selectedDate: format(selectedDate, 'yyyy-MM-dd') }
    });
  };

  const isDailyGoalCompleted = profileData?.profileData?.target_calories
    ? (mealPlanData.progressMeal?.progress_cal || 0) >= profileData.profileData.target_calories
    : false;
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const isSelectedDateDeletable = selectedDate >= today;
  const wasPreviousDatePast = previousSelectedDate < today;
  const mustWaitForDateSync = isSelectedDateDeletable && wasPreviousDatePast;
  const isSelectedDateSynced = !isMealPlanLoading && loadedMealPlanDate === selectedDateKey;
  const canDeleteMeals = isSelectedDateDeletable && (!mustWaitForDateSync || isSelectedDateSynced);

  const renderDateItem = ({ item, index }: { item: Date; index: number }) => {
    const isSelected = format(item, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const isToday = format(item, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    return (
      <TouchableOpacity
        onPress={() => handleDatePress(item, index)}
        className={`mr-3 w-16 h-24 rounded-2xl items-center justify-center ${isSelected ? 'bg-primary-400' : 'bg-white'} ${isToday ? 'border-2 border-primary-500' : ''}`}
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

  const macros = [
    {
      key: 'pro',
      label: 'Protein',
      colorClass: 'bg-primary-500',
      current: mealPlanData.progressMeal?.progress_pro || 0,
      target: profileData?.profileData?.target_proteins || 1,
    },
    {
      key: 'carbs',
      label: 'Carbs',
      colorClass: 'bg-amber-500',
      current: mealPlanData.progressMeal?.progress_carbs || 0,
      target: profileData?.profileData?.target_carbs || 1,
    },
    {
      key: 'fat',
      label: 'Fat',
      colorClass: 'bg-emerald-500',
      current: mealPlanData.progressMeal?.progress_fat || 0,
      target: profileData?.profileData?.target_fats || 1,
    },
  ];

  return (
    <SafeAreaView className='bg-secondary-400' edges={['top']}>
      <ScrollView className='h-full w-full px-6 pt-7' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-4xl text-primary-500 font-fogsta">My Plan</Text>

        {/* Horizontal Calendar */}
        <View className='h-24 mt-6'>
          <FlatList
            ref={flatListRef}
            data={dates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={7}
            getItemLayout={(data, index) => ({ length: 44, offset: 44 * index, index })}
          />
        </View>

        {/* Progress Card */}
        <View className="bg-secondary-200 rounded-3xl p-6 mt-6">
          <View className="items-center mt-6">
            <AnimatedCircularProgress
              size={176}
              width={18}
              fill={
                profileData?.profileData?.target_calories
                  ? Math.min(
                      ((mealPlanData.progressMeal?.progress_cal || 0) /
                        profileData.profileData.target_calories) * 100,
                      100
                    )
                  : 0
              }
              tintColor="#660B05"
              backgroundColor="#E5E7EB"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <View className="items-center">
                  <Text className="text-5xl font-fogsta">
                    {mealPlanData.progressMeal?.progress_cal || 0}
                  </Text>
                  <Text className="text-xs text-gray-500 text-center px-2">
                    kcal left of {profileData?.profileData?.target_calories || 0}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>

          <View className="mt-6 flex-row justify-between">
            {macros.map((macro) => (
              <MacroBar
                key={macro.key}
                percentage={Math.min((macro.current / macro.target) * 100, 100)}
                colorClass={macro.colorClass}
                label={macro.label}
                current={macro.current}
                target={macro.target}
              />
            ))}
          </View>
        </View>

        {/* Meal Sections */}
        <View className="mt-6">
          {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((mealTitle) => {
            const mealType = mealTitle.toLowerCase();
            return (
              <MealSection
                key={mealType}
                title={mealTitle}
                type={mealType}
                data={mealPlanData.mealPlanData}
                isComplete={isDailyGoalCompleted}
                canDeleteMeals={canDeleteMeals}
                onAdd={() => handleAddMeal(mealType)}
                onDelete={(meal) => handleDeletePlan({
                  mealId: meal.id,
                  date: format(selectedDate, 'yyyy-MM-dd'),
                  cal: Math.round(mealPlanData?.progressMeal?.progress_cal - (meal.Calories) || 0),
                  pro: Math.round(mealPlanData?.progressMeal?.progress_pro - (meal.ProteinContent) || 0),
                  fat: Math.round(mealPlanData?.progressMeal?.progress_fat - (meal.FatContent) || 0),
                  carbs: Math.round(mealPlanData?.progressMeal?.progress_carbs - (meal.CarbohydrateContent) || 0)
                })}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MealSection = ({ title, type, data, onAdd, onDelete, isComplete, canDeleteMeals }: MealSectionProps) => {
  const filteredMeals = data.filter((meal) => meal.meal_time === type);

  return (
    <View className="bg-white rounded-3xl p-5 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-brsegma-600">{title}</Text>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${isComplete ? 'bg-gray-300' : 'bg-primary-500'}`}
          disabled={isComplete}
          onPress={onAdd}
        >
          <Text className="text-sm font-semibold text-white">+ Add</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 flex flex-col gap-3">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal: any, index: number) => (
            <View key={meal.id || index} className={`flex-row items-center ${meal.is_eaten ? 'bg-green-200' : 'bg-secondary-400'} rounded-2xl p-3`}>
              <Image className="w-14 h-14 rounded-2xl" source={{ uri: meal.Images }} />

              <View className="flex-1 ml-3">
                <Text className="font-semibold text-black" numberOfLines={1}>
                  {meal.name || 'Unknown Meal'}
                </Text>
                <Text className="text-xs text-gray-500">
                  {meal.Calories || 0} kcal · {meal.TotalTime || '0 mins'}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-[10px] text-gray-500">{meal.CarbohydrateContent || 0}g carbs</Text>
                  <Text className="text-[10px] text-gray-500 ml-2">{meal.FatContent || 0}g fats</Text>
                  <Text className="text-[10px] text-gray-500 ml-2">{meal.ProteinContent || 0}g prot</Text>
                </View>
              </View>

              {canDeleteMeals && !meal.is_eaten && (
                <View className="flex-row items-center">
                  <TouchableOpacity className="p-2 rounded-full bg-white" onPress={() => onDelete(meal)}>
                    <Ionicons name="trash-outline" size={12} color="gray" />
                  </TouchableOpacity>
                </View>
              )}
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