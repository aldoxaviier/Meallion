import api from "../utils/api";
import { Text, View, Image, TextInput, ScrollView, Pressable } from "react-native";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileDataContext } from "../store/profileDataContext";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Index() {
  const [loading, setLoading] = useState(true)
  const profileData = useContext(ProfileDataContext)

  const categories = [
  { label: "Vegan", icon: "leaf", bg: "bg-green-400" },
  { label: "Low Sugar", icon: "cubes", bg: "bg-amber-300" },
  { label: "Low\nCholesterol", icon: "heart", bg: "bg-red-400" },
  { label: "High\nProtein", icon: "drumstick-bite", bg: "bg-yellow-300" },
  { label: "test1", icon: "drumstick-bite", bg: "bg-orange-400" },
  { label: "test2", icon: "fish", bg: "bg-blue-400" },
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

        fetchProfile()
  }, [])

  const handleCategories = (categories) => {

  }

  return (
    <SafeAreaView className="bg-green-200">
    <View className=" bg-secondary-400 h-full w-full flex items-center">
        <View className="w-full px-6 py-8 flex gap-7">
          <View className="flex flex-row items-center gap-3">
            <Image className="w-16 h-16 rounded-full"
                  source={require('../../assets/images/android-icon-background.png')}>
            </Image>
            <View>
              <Text className="text-primary-500 text-2xl font-fogsta">Hey,{profileData?.profileData?.users.name}</Text>
              <Text className="text-primary-500 text-xs font-brsegma-500">Good Morning</Text>
            </View>
          </View>
          <View className="gap-4">
            <Text className="text-primary-500 text-2xl font-fogsta">What flavors are you{'\n'}craving today?</Text>
            <TextInput className="bg-white rounded-full" placeholder="Find Your Meal..."></TextInput>
          </View>
          <View className="flex gap-3">
            <Text className="text-xl font-fogsta">Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {categories.map((item) => (
                <Pressable key={item.label} onPress={() => handleCategories(item.label)}>
                <View key={item.label} className="items-center">
                  <View
                    className={`size-20 rounded-full items-center justify-center ${item.bg}`}
                  >
                    <FontAwesome5 name={item.icon} size={28} color="black" />
                  </View>
                  <Text className="text-center font-brsegma-600">
                    {item.label}
                  </Text>
                </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
        <View>
          
        </View>
    </View>
    </SafeAreaView>
    
  );
}
