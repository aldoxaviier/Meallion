import { useLocalSearchParams, Stack, router } from "expo-router";
import { Animated, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { ScrollView } from "react-native";
import NutritionTab from "./component/NutritionTab";
import InstructionsTab from "./component/InstructionTab";
import ReviewsTab from "./component/ReviewsTab";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HEADER_HEIGHT_NARROWED = 150;
const HEADER_HEIGHT_EXPANDED = 35;

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)

export default function dynamicRecipe() {
  const { id } = useLocalSearchParams()
  console.log(id)
  const [recipeData, setRecipeData] = useState<any>([])
  
  const fetchRecipeData = async () => {
    try {
      const response = await api.get(`/recipes/getRecipesByID?id=${id}`);
      if (response?.data) {
        setRecipeData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  useEffect(() => {
    fetchRecipeData();
  }, [id]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-secondary-400">
        <Stack.Screen options={{ headerShown: false }} />
        <Page recipeData={recipeData} onRefresh={fetchRecipeData} />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

function Page({ recipeData, onRefresh }: { recipeData: any, onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const insets = useSafeAreaInsets()
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT_NARROWED + HEADER_HEIGHT_EXPANDED + insets.top;
  const tabs = ['Nutrition', 'Recipe', 'Reviews'];
  const recipeTags = recipeData?.tags?.split(' | ') || [];
  const tabWidth = (containerWidth - 8) / tabs.length;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, tabWidth, tabWidth * 2],
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT_NARROWED],
    outputRange: [0, -HEADER_HEIGHT_NARROWED],
    extrapolate: 'clamp'
  });

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT_NARROWED],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const scale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [3, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp'
  });

  const handlePress = (index : any) => {
    setActiveTab(index);
    Animated.spring(slideAnim, {
      toValue: index,
      useNativeDriver: true, 
      speed: 12, 
      bounciness: 4, 
    }).start();
  };

  return (
    <View className="overflow-hidden">
      {/* Back button */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 20,
          left: 20,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" color="white" size={30}></Ionicons>
      </TouchableOpacity>

      {/* Recipe Image */}
      <AnimatedImageBackground
        source={{uri: recipeData?.Images}}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: TOTAL_HEADER_HEIGHT,
          transform: [ { translateY }, { scale } ]
        }} />
      
      <AnimatedImageBackground
        source={{ uri: recipeData?.Images }}
        blurRadius={20}
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 0,
          height: TOTAL_HEADER_HEIGHT,
          opacity: blurOpacity,
          transform: [ { translateY }, { scale } ]
        }} />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )
        }
        style={{
          zIndex: 3
        }}
        contentContainerStyle={{
          paddingTop: TOTAL_HEADER_HEIGHT -30,
          paddingBottom: insets.bottom + 50
        }}>
        <View className="p-6 bg-secondary-400 rounded-t-[30px]">
          <View className="bg-gray-900 self-center w-[15rem] h-[3px] rounded-full"></View>
          <View className="my-9">
            <Text className="font-fogsta text-4xl">
              {recipeData.name}
            </Text>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 5, marginTop: 10 }}
            >
              {recipeTags.map((item: string, index: number) => (
                <View key={index} className="bg-white px-3 py-1 rounded-full">
                  <Text className="font-brsegma-600 font-bold text-primary-400">
                    {item}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Text className="font-brsegma-500 mt-5 p-1">
              {recipeData.Description}
            </Text>

            <View className="flex flex-row bg-primary-500 p-5 rounded-xl mt-7">
              <View className="flex-1 flex-row justify-center items-center border-r border-white">
                <Ionicons name="star-outline" size={16} color="white" />
                <Text className="font-brsegma-500 text-white font-bold ml-2">{recipeData.rating_score || "0"}</Text>
                <Text className="font-light text-white ml-2">(200)</Text>
              </View>
              <View className="flex-1 flex-row justify-center items-center border-r border-white">
                <Text className="font-brsegma-500 text-white font-bold">{recipeData.TotalTime}</Text>
              </View>
              <View className="flex-1 flex-row justify-center items-center">
                <Ionicons name="restaurant-outline" size={16} color="white" />
                <Text className="font-brsegma-500 text-white font-bold ml-2">{recipeData.RecipeServings} Servings</Text>
              </View>
            </View>
          </View>

          <View className="bg-[#E1D9C9] rounded-xl flex-row p-1 mb-7 mt-4 relative" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
            {containerWidth > 0 && (
              <Animated.View
                className="absolute bg-white rounded-[10px] top-1 bottom-1 left-1"
                style={{
                  width: tabWidth,
                  transform: [{ translateX }],
                }} />
            )}

            {tabs.map((tab, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => handlePress(index)}
                className="flex-1 py-3 items-center z-10">
                <Text className={`font-bold ${activeTab === index ? 'text-black' : 'text-gray-500'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View className="mb-10">
            {activeTab === 0 && (
              <NutritionTab 
                recipeData={recipeData} />
            )}
            
            {activeTab === 1 && (
              <InstructionsTab 
                recipeData={recipeData} />
            )}

            {activeTab === 2 && (
              <ReviewsTab 
                recipeData={recipeData} 
                onReviewSuccess={onRefresh} />
            )}
          </View>

        </View>
      </Animated.ScrollView>
    </View>
  )
}