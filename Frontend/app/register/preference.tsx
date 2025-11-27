import { View,Text,TouchableHighlight,TouchableOpacity,StyleSheet,ActivityIndicator, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import PreferenceCard from "../components/PreferenceCard";
import { snapPoint } from "react-native-redash";
import api from "../utils/api";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 450;
const SNAP_POINTS = [-width - 150, 0, width + 150];
const preference = () => {
    const router = useRouter();
      // Gesture and animation moved into PreferenceCard component
    const [recipes, setRecipes] = useState<any[]>([]);

    // Removed gesture logic

    const getRecipes = async () => {
      try {
        const response = await api.get('/recipes/get10Recipes');
        const data = response.data.data.recipes;
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    }

    useEffect(() => {
      getRecipes();
    }, []);

    console.log("recipes:", recipes[1]);

    return (
        <>
        <SafeAreaView className="bg-secondary-400 flex-1">
            <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                </View>
                <View className="flex flex-col justify-between flex-1">
                    <Text className="text-4xl font-fogsta text-primary-500 text-center">Enjoy planning your meal with Meallion</Text>
                    <PreferenceCard>
                      <Text className="font-brsegma-600 text-4xl">Swipe Me</Text>
                    </PreferenceCard>
                    <TouchableOpacity className="py-4 px-10 self-center rounded-full bg-primary-500" onPress={() => router.push('/register/personal')}>
                        <Text className="text-center font-brsegma-600 text-secondary-400 ">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "#ff7f50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});

export default preference;