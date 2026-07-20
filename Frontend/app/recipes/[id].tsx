import { useLocalSearchParams, Stack, router } from "expo-router";
import { Animated, View, Text, TouchableOpacity, ImageBackground, Alert, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef, useContext } from "react";
import { api } from "../utils/api";
import { ScrollView } from "react-native";
import NutritionTab from "./component/NutritionTab";
import InstructionsTab from "./component/InstructionTab";
import ReviewsTab from "./component/ReviewsTab";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProfileDataContext } from "../store/profileDataContext";
import { useColorScheme } from "nativewind";
import { WarningModal } from "../components/WarningModal";

const HEADER_HEIGHT_NARROWED = 150;
const HEADER_HEIGHT_EXPANDED = 35;

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)

export default function dynamicRecipe() {
  const { id } = useLocalSearchParams()
  const [recipeData, setRecipeData] = useState<any>([])
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    confirmColor: "bg-primary-500"
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
  };

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
      const response = await api.post(`/recipes/addLikes`, { recipeId: id, interaction: 'SAVE' });
      
      if (response.data?.isDuplicate) {
        setModalConfig({
          visible: true,
          title: "Warning",
          message: "Recipe already liked!",
          confirmColor: "bg-yellow-500"
        });
      } else {
        setModalConfig({
          visible: true,
          title: "Success",
          message: "Recipe saved to your likes!",
          confirmColor: "bg-third-500"
        });
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
      <Page recipeData={recipeData} onRefresh={fetchRecipeData} addLikes={handleLikes} />
      <WarningModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        isAlertOnly={true}            
        confirmText="OK"              
        confirmColor={modalConfig.confirmColor}
        onClose={closeModal}
        onConfirm={closeModal}        
      />
    </GestureHandlerRootView>
  )
}

function Page({ recipeData, onRefresh, addLikes }: { recipeData: any, onRefresh: () => void, addLikes: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [servings, setServings] = useState<number>(1);
  const insets = useSafeAreaInsets()
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT_NARROWED + HEADER_HEIGHT_EXPANDED + insets.top;
  const tabs = ['Nutrition', 'Recipe', 'Reviews'];
  const recipeTags = recipeData?.tags?.split(' | ') || [];
  const tabWidth = (containerWidth - 8) / tabs.length;
  const url = process.env.EXPO_PUBLIC_API_URL;
  const profileData = useContext(ProfileDataContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const baseServings = Number(recipeData?.RecipeServings) || 1;

  useEffect(() => {
    if (recipeData?.RecipeServings) {
      setServings(Number(recipeData.RecipeServings));
    }
  }, [recipeData?.RecipeServings]);

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

  const handlePress = (index: any) => {
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
    <View className="overflow-hidden bg-secondary-400 dark:bg-background-dark">
      <TouchableOpacity
        className="absolute z-10 top-20 left-5 rounded-[15px] items-center justify-center bg-black/60"
        onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" color="white" size={30}></Ionicons>
      </TouchableOpacity>

      <AnimatedImageBackground
        source={{ uri: getImages(recipeData?.Images) }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: TOTAL_HEADER_HEIGHT,
          transform: [{ translateY }, { scale }]
        }} />

      <AnimatedImageBackground
        source={{ uri: getImages(recipeData?.Images) }}
        blurRadius={20}
        style={{
          position: 'absolute',
          left: 0, right: 0, top: 0,
          height: TOTAL_HEADER_HEIGHT,
          opacity: blurOpacity,
          transform: [{ translateY }, { scale }]
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
          paddingTop: TOTAL_HEADER_HEIGHT - 30,
          paddingBottom: insets.bottom + 50
        }}>
        <View className="pt-6 px-6 bg-secondary-400 dark:bg-background-dark rounded-t-[30px]">
          <View className="bg-gray-900 dark:bg-gray-600 self-center w-[15rem] h-[3px] rounded-full"></View>
          <View className="my-9">
            <Text className="font-fogsta text-4xl dark:text-secondary-400">
              {recipeData.name}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 5, marginTop: 10 }}
            >
              {recipeTags.map((item: string, index: number) => (
                <View key={index} className="bg-white dark:bg-surface-dark px-3 py-1 rounded-full">
                  <Text className="font-brsegma-600 text-primary-400 dark:text-secondary-400">
                    {item}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Text className="font-brsegma-500 mt-5 p-1 dark:text-secondary-400">
              {recipeData.Description}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (recipeData?.user_id === profileData?.profileData?.user_id) {
                  router.push("/profile" as any);
                  return;
                }
                router.push(`/profiles/${recipeData.user_id}` as any);
              }}
              className="flex-row items-center mt-4 ml-1"
            >
              <Image
                source={
                  recipeData?.profile_image
                    ? { uri: recipeData.profile_image }
                    : require('../../assets/images/android-icon-background.png')
                }
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-surface-darker"
              />
              <View className="ml-2">
                <Text className="text-[15px] text-gray-600 dark:text-secondary-400 font-brsegma-600">
                  Recipe by
                </Text>
                <Text className="font-brsegma-600 font-bold text-sm text-gray-900 dark:text-secondary-400">
                  {recipeData?.author_name || 'Unknown Author'}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="flex flex-row bg-primary-500 dark:bg-surface-dark p-5 rounded-xl mt-7">
              {/* Rating */}
              <View className="flex-1 flex-row justify-center items-center border-r border-white dark:border-surface-darker">
                <Ionicons name="star-outline" size={16} color={isDark ? "#eddca1" : "white"} />
                <Text className="font-brsegma-500 text-white dark:text-secondary-400 font-bold ml-2">
                  {recipeData.rating_score || "0"}
                </Text>
                <Text className="font-light text-white dark:text-secondary-400 ml-2">({recipeData.rating_total || 0})</Text>
              </View>

              {/* Total Time */}
              <View className="flex-1 flex-row justify-center items-center border-r border-white dark:border-surface-darker">
                <Text className="font-brsegma-500 text-white dark:text-secondary-400 font-bold">
                  {recipeData.TotalTime}
                </Text>
              </View>

              {/* Servings with +/- controls */}
              <View className="flex-1 flex-row justify-center items-center gap-2">
                <Ionicons name="restaurant-outline" size={16} color={isDark ? "#eddca1" : "white"} />
                <TouchableOpacity
                  onPress={() => setServings((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white dark:text-secondary-400 font-bold leading-none">−</Text>
                </TouchableOpacity>
                <Text className="font-brsegma-600 text-white dark:text-secondary-400 min-w-[20px] text-center">
                  {servings}
                </Text>
                <TouchableOpacity
                  onPress={() => setServings((prev) => prev + 1)}
                  className="w-6 h-6 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white dark:text-secondary-400 font-bold leading-none">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Tab Switcher */}
          <View
            className="bg-[#E1D9C9] dark:bg-surface-darker rounded-xl flex-row p-1 mb-7 mt-4 relative"
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
            {containerWidth > 0 && (
              <Animated.View
                className="absolute bg-white dark:bg-surface-dark rounded-[10px] top-1 bottom-1 left-1"
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
                <Text className={`font-bold ${activeTab === index ? 'text-black dark:text-secondary-400' : 'text-gray-500 dark:text-gray-600'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View className="mb-6">
            {activeTab === 0 && (
              <NutritionTab
                recipeData={recipeData}
                servings={servings}
                baseServings={baseServings}
              />
            )}

            {activeTab === 1 && (
              <InstructionsTab
                recipeData={recipeData}
                servings={servings}
                baseServings={baseServings}
              />
            )}

            {activeTab === 2 && (
              <ReviewsTab
                recipeData={recipeData}
                onReviewSuccess={onRefresh}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>
      <TouchableOpacity
        className="absolute z-20 bottom-11 left-6 right-6 bg-primary-500 dark:bg-primary-600 py-4 items-center justify-center rounded-xl"
        onPress={() => addLikes()}>
        <Text className="font-brsegma-600 text-white dark:text-secondary-400 text-lg">
          Love this!
        </Text>
      </TouchableOpacity>
    </View>
  )
}