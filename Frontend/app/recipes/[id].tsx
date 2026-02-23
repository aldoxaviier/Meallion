import { useLocalSearchParams, Stack, router } from "expo-router";
import { Animated, View, Text, TouchableOpacity, Pressable, ImageBackground } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { ScrollView } from "react-native";

const HEADER_HEIGHT_NARROWED = 150;
const HEADER_HEIGHT_EXPANDED = 35;

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)

export default function dynamicRecipe() {
  const { id } = useLocalSearchParams()
  console.log(id)
  const [recipeData, setRecipeData] = useState<any>([])
  

  useEffect(() => {
    const getRecipeData = async () => {
      try {
        const response = await api.get(`/recipes/getRecipesByID?id=${id}`)
        if (response) {
          setRecipeData(response.data[0])
        }
        
      } catch (error) {
        console.error(error)
      }
    }
    getRecipeData()
  }, [id])



  return (
    <SafeAreaView className="bg-secondary-200">
      <Stack.Screen options={{ headerShown: false }} />
      <Page recipeData={recipeData}/>
    </SafeAreaView>
  )
}

function Page({ recipeData }: { recipeData: any }) {
  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current;
  const TOTAL_HEADER_HEIGHT = HEADER_HEIGHT_NARROWED + HEADER_HEIGHT_EXPANDED + insets.top;
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
      
      

      {/* scroll view */}
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
        <View className="p-6 bg-secondary-200 rounded-t-[30px]">
          
          <Text className="font-fogsta text-4xl">
            {recipeData.name}
          </Text>

          <View className="flex flex-row flex-wrap gap-x-3">
            {recipeData?.tags && recipeData.tags.split(' | ').map((tag: string, index: number) => (
              <View key={index} className="bg-white px-3 py-1 rounded-full">
                <Text className="font-brsegma-600 font-bold text-primary-400">
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text className="font-brsegma-600">
            {recipeData.Description}
          </Text>

          {/* Stats Bar */}
          <View className="flex flex-row bg-primary-500 p-5 rounded-xl">
            <View className="flex-1 flex-row justify-center items-center border-r border-white">
              <Ionicons name="star-outline" size={16} color="white" />
              <Text className="font-brsegma-500 text-white font-bold ml-2">{recipeData.rating_score || "0"} <Text style={{ fontWeight: '400' }}>(200)</Text></Text>
            </View>
            <View className="flex-1 flex-row justify-center items-center border-r border-white">
              <Text className="font-brsegma-500 text-white font-bold">{recipeData.TotalTime}</Text>
            </View>
            <View className="flex-1 flex-row justify-center items-center">
              <Ionicons name="restaurant-outline" size={16} color="white" />
              <Text className="font-brsegma-500 text-white font-bold ml-2">{recipeData.RecipeServings}</Text>
            </View>
          </View>

          {/* Tab Menu */}
          <View style={{ backgroundColor: '#E1D9C9', borderRadius: 12, flexDirection: 'row', padding: 4, marginBottom: 30 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Total Calories Card */}
          <View style={{ backgroundColor: '#4A140B', borderRadius: 16, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <View>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Total Calories</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ color: 'white', fontSize: 56, fontWeight: '300', letterSpacing: -2 }}>300</Text>
                <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold' }}>kcal</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 }}>per serving</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="flame" size={36} color="white" />
            </View>
          </View>

          {/* Micronutrients */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#311004', marginBottom: 15 }}>
            Micronutrients
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}>
            
            {/* Group 1 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#DED066', marginRight: 10 }} />
                <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Carbs</Text>
              </View>
              <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.CarbohydrateContent} g</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5A5F', marginRight: 10 }} />
                <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Protein</Text>
              </View>
              <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.ProteinContent} g</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF9F1C', marginRight: 10 }} />
                <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Fiber</Text>
              </View>
              <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.FiberContent} g</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#33A1FD', marginRight: 10 }} />
                <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Sugar</Text>
              </View>
              <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.SugarContent} g</Text>
            </View>
            
            {/* Group 2 */}
            <View style={{ paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#40C9A2', marginRight: 10 }} />
                  <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Fat</Text>
                </View>
                <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.FatContent} g</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#5E4AE3', marginRight: 10 }} />
                  <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Saturated fat</Text>
                </View>
                <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.SaturatedFatContent} g</Text>
              </View>
            </View>

            {/* Group 3 */}
            <View style={{ paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#A07A6D', marginRight: 10 }} />
                  <Text style={{ color: '#4A4A4A', fontSize: 14 }}>Cholesterol</Text>
                </View>
                {/* Kolesterol biasanya satuannya miligram (mg) */}
                <Text style={{ color: '#1A1A1A', fontSize: 14 }}>{recipeData?.CholesterolContent} mg</Text>
              </View>
            </View>

          </View>

        </View>
      </Animated.ScrollView>
    </View>
  )
}