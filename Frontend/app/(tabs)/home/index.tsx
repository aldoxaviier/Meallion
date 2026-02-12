import api from "../../utils/api";
import { Text, View, Image, TextInput, ScrollView, Pressable, Button, TouchableHighlight, FlatList } from "react-native";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileDataContext } from "../../store/profileDataContext";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import "../../globals.css"
import { TenRecipeContext } from "@/app/store/tenRecipeContext";


export default function Index() {
  const [loading, setLoading] = useState(true)
  const profileData = useContext(ProfileDataContext)
  const tenRecipe = useContext(TenRecipeContext)
  const [TenRecipe, setTenRecipe] = useState<any>([]);

  const categories = [
    { label: "Vegan", url:'vegan', icon: "leaf", bg: "bg-green-400" },
    { label: "Low Sugar", url:'low-sugar', icon: "cubes", bg: "bg-amber-300" },
    { label: "Low Cholesterol", url:'low-cholesterol', icon: "heart", bg: "bg-red-400" },
    { label: "High Protein", url:'high-protein', icon: "drumstick-bite", bg: "bg-yellow-300" },
    { label: "Low Protein", url:'low-protein', icon: "drumstick-bite", bg: "bg-orange-400" },
    { label: "European", url:'test2', icon: "fish", bg: "bg-blue-400" },
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
              tenRecipe?.setTenRecipe(RecipeRes.data.data.recipes)
            }
          } catch (err: any) {
            console.log(err)
          }
        }

        get10Recipe()
        fetchProfile()
  }, [])

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
      <View className="w-full px-6 mt-8 flex gap-7">

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
          <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
            <FontAwesome5 name="search" size={24} color="gray" />
              <TextInput 
                className="flex-1 ml-3 text-base text-gray-700" 
                placeholder="Find your meaandl..." 
              />
          </View>
        </View>

        {/* Categories */}
        <View className="gap-3">
          <Text className="text-xl font-fogsta">Categories</Text>
          <FlatList
            data={categories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item }) => {
              return(
                <TouchableHighlight onPress={() => handleCategories(item.url)}>
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
                </TouchableHighlight>
              )
            }}
          >
          </FlatList>
        </View>

        {/* 10 recipe */}
        <View className="gap-3">
          <Text className="text-xl font-fogsta">For You</Text>
          <FlatList
            data={tenRecipe?.TenRecipe}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item }) => {
              return (
                <View key={item.recipe_id} className="w-56 p-3 gap-2 bg-white rounded-xl shadow-sm">
                  <View className="relative mb-3">
                    <Image
                      source={{uri: item.Images}}
                      className="w-full h-32 rounded-lg"
                    />
                    <View className="absolute top-24 -ml-1 w-10 h-10 bg-white rounded-full items-center justify-center">
                        <Image className="w-8 h-8 rounded-full" source={require('../../../assets/images/android-icon-background.png')}></Image>
                    </View>
                  </View>
                  <Text className="text-[10px] text-gray-500 font-medium">
                    By {item.author_name || "Chef"}
                  </Text>
                  <View className="h-12">
                    <Text className="font-fogsta text-l">{item.name}</Text>
                  </View>
                  <View className="flex flex-row items-center gap-1">
                    <FontAwesome5 name="star" size={9} color="black" />
                    <Text className="font-brsegma-600 text-[10px] text-gray-700">{item.rating_score ?? "No Rate"} · {item.TotalTime}</Text>
                  </View>
                  <TouchableHighlight className="bg-primary-400 btn-default mt-auto">
                    <Text className="text-secondary-400 font-fogsta">Add To Plan</Text>
                  </TouchableHighlight>
                </View>
              );
            }}>
          </FlatList>
        </View>
      </View>
    </View>
    </SafeAreaView>
    
  );
}
