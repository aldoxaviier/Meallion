import { useLocalSearchParams, Stack, router } from "expo-router";
import { Animated, View, Text, TouchableOpacity, ImageBackground, Alert, Image } from "react-native";
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
  const [recipeData, setRecipeData] = useState<any>([])
  
  const fetchRecipeData = async () => {
    try {
      const response = await api.get(`/recipes/getRecipesByID?id=${id}`);
      if (response?.data) {
        setRecipeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const handleLikes = async () => {
    try {
      const response = await api.post(`/recipes/addLikes`, { recipeId: id });
      if (response.data?.isDuplicate) {
        Alert.alert("Warning", "Recipe already liked!");
      } else {
        Alert.alert("Success", "Recipe saved to your likes!"); 
      }
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  useEffect(() => {
    fetchRecipeData();
  }, [id]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Page recipeData={recipeData} onRefresh={fetchRecipeData} addLikes={handleLikes}/>
    </GestureHandlerRootView>
  )
}

function Page({ recipeData, onRefresh, addLikes }: { recipeData: any, onRefresh: () => void, addLikes: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const insets = useSafeAreaInsets()
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT_NARROWED + HEADER_HEIGHT_EXPANDED + insets.top;
  const tabs = ['Nutrition', 'Recipe', 'Reviews'];
  const recipeTags = recipeData?.tags?.split(' | ') || [];
  const tabWidth = (containerWidth - 8) / tabs.length;
  const url = process.env.EXPO_PUBLIC_API_URL;
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

  const getImages = (images: string) => {
    if (images?.includes('https')) {
      return images;
    }
    return `${url}/${images}`;
  }

  return (
    <View className="overflow-hidden bg-secondary-400">
      {/* Back button */}
      <TouchableOpacity 
        className="absolute z-10 top-20 left-5 rounded-[15px] items-center justify-center bg-black/60"
        onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" color="white" size={30}></Ionicons>
      </TouchableOpacity>

      {/* Recipe Image */}
      <AnimatedImageBackground
        source={{ uri: getImages(recipeData?.Images) }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: TOTAL_HEADER_HEIGHT,
          transform: [ { translateY }, { scale } ]
        }} />
      
      <AnimatedImageBackground
        source={{ uri: getImages(recipeData?.Images) }}
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
            {/* Author Profile Section - under description */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (!recipeData?.user_id) {
                  Alert.alert("Error", "User not found");
                  return;
                }
                router.push({ pathname: '/(tabs)/profile', params: { user_id: recipeData.user_id } });
              }}
              className="flex-row items-center mt-4 ml-1"
            >
              <Image
                source={
                  recipeData?.profile_image
                    ? { uri: `${process.env.EXPO_PUBLIC_API_URL}/${recipeData.profile_image}` }
                    : require('../../assets/avatar/profile_dumb.jpg')
                }
                className="w-9 h-9 rounded-full"
              />
              <View className="ml-2">
                <Text className="text-[15px] text-gray-600 uppercase font-brsegma-800">
                  Recipe by
                </Text>
                <Text className="font-brsegma-600 font-bold text-sm text-gray-900">
                  {recipeData?.author_name || 'Unknown Author'}
                </Text>
              </View>
            </TouchableOpacity>

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

      {/* Add to Plan Button */}
      <TouchableOpacity
        className="absolute z-10 bottom-11 left-0 right-0 bg-primary-500 py-4 items-center justify-center m-6 rounded-xl"
        onPress={() => addLikes()}>
        <Text className="font-brsegma-600 text-white font-bold text-lg">
          Save to Likes
        </Text>
      </TouchableOpacity>
    </View>
  )
}