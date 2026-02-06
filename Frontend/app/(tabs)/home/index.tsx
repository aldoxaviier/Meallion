import api from "../../utils/api";
import { Text, View, Image, TextInput, ScrollView, Pressable, Button, TouchableHighlight } from "react-native";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileDataContext } from "../../store/profileDataContext";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import "../../globals.css"


export default function Index() {
  const [loading, setLoading] = useState(true)
  const profileData = useContext(ProfileDataContext)
  const [TenRecipe, setTenRecipe] = useState<any>([]);

  const categories = [
    { label: "Vegan", url:'vegan', icon: "leaf", bg: "bg-green-400" },
    { label: "Low Sugar", url:'low-sugar', icon: "cubes", bg: "bg-amber-300" },
    { label: "Low Cholesterol", url:'low-cholesterol', icon: "heart", bg: "bg-red-400" },
    { label: "High Protein", url:'high-protein', icon: "drumstick-bite", bg: "bg-yellow-300" },
    { label: "test1", url:'test1', icon: "drumstick-bite", bg: "bg-orange-400" },
    { label: "test2", url:'test2', icon: "fish", bg: "bg-blue-400" },
  ];

  useEffect(() => {
        const fetchProfile = async () => {
            try {
              const response = await api.get('/profile/getProfile')
              profileData?.setProfileData(response.data.data.data[0])
            } catch (err: any) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        const get10Recipe = async () => {
          try {
            const RecipeRes = await api.get('/recipes/get10Recipes')
            if(RecipeRes){
              setTenRecipe(RecipeRes.data.data.recipes)
            }
          } catch (err: any) {
            console.log(err)
          }
        }

        get10Recipe()
        fetchProfile()
  }, [])

  useEffect(() => {
    console.log(TenRecipe);
  }, [TenRecipe])

  const handleCategories = (category : string) => {
    const selectedCategories = categories.find(item => item.url === category);

    if(!selectedCategories) return;

    router.push({
      pathname: '/home/[category]',
      params: {
        category: selectedCategories.url,
        title: selectedCategories.label
      }
    });
  }

  return (
    <SafeAreaView className="bg-green-200">
    <View className=" bg-secondary-400 h-full w-full flex items-center">
      <View className="w-full px-6 py-8 flex gap-7">
        {/* Profile */}
        <View className="flex flex-row items-center gap-3">
          <Image className="w-16 h-16 rounded-full"
                source={require('../../../assets/images/android-icon-background.png')}>
          </Image>
          <View>
            <Text className="text-primary-500 text-2xl font-fogsta">Hey,{profileData?.profileData?.users.name}</Text>
            <Text className="text-primary-500 text-xs font-brsegma-500">Good Morning</Text>
          </View>
        </View>
        {/* Search Bar */}
        <View className="flex gap-4">
          <Text className="text-primary-500 text-2xl font-fogsta">What flavors are you{'\n'}craving today?</Text>
          <TextInput className="bg-white rounded-full" placeholder="Find Your Meal..."></TextInput>
        </View>
        {/* Categories */}
        <View className="flex gap-3">
          <Text className="text-xl font-fogsta">Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {categories.map((item) => (
              <Pressable key={item.label} onPress={() => handleCategories(item.url)}>
              <View key={item.label} className="items-center">
                <View
                  className={`size-20 rounded-full items-center justify-center ${item.bg}`}
                >
                  <FontAwesome5 name={item.icon} size={28} color="black" />
                </View>
                <Text className="text-center font-brsegma-600 w-24">
                  {item.label}
                </Text>
              </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        {/* 10 recipe */}
        <View className="flex gap-3">
          <Text className="text-xl font-fogsta">For You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {TenRecipe &&
              TenRecipe.map((recipe : any) => (
                <View key={recipe.recipe_id} className="w-44 p-2 gap-2 bg-white rounded-xl overflow-hidden">
                  <Image
                    source={{uri: recipe.Images}}
                    className="w-full h-24 rounded-lg"
                  />
                  <View className="h-12">
                    <Text className="font-brsegma-600 text-sm">{recipe.name}</Text>
                  </View>
                  <View className="flex flex-row items-center gap-1">
                    <FontAwesome5 name="star" size={9} color="black" />
                    <Text className="font-brsegma-600 text-[10px] text-gray-700">{recipe.rating_score ?? "No Rate"} · {recipe.TotalTime}</Text>
                  </View>
                  <TouchableHighlight className="bg-primary-400 btn-default mt-auto">
                    <Text className="text-white font-brsegma-600">Add To Meal Plan</Text>
                  </TouchableHighlight>
                </View>
              ))
            }
          </ScrollView>
        </View>
      </View>
    </View>
    </SafeAreaView>
    
  );
}
