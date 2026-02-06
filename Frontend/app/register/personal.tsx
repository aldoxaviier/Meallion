import { View, Text, TouchableOpacity, FlatList,Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import api from "../utils/api";
import { ProfileContext } from "../store/profileContext";
const Personal = () => {
  const router = useRouter();
  const choices = [
    "Pescatarian",
    "Vegetarian",
    "Vegan",
    "Dairy-free",
    "Gluten-free",
    "Pork-free",
  ];
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const profileContext = useContext(ProfileContext);

  const imageMap: { [key: string]: any } = {
    "Pescatarian": require("../../assets/images/pescatarian.png"),
    "Vegetarian": require("../../assets/images/vegetarian.png"),
    "Vegan": require("../../assets/images/vegan.png"),
    "Dairy-free": require("../../assets/images/dairy-free.png"),
    "Gluten-free": require("../../assets/images/gluten-free.png"),
    "Pork-free": require("../../assets/images/pork-free.png"),
  };

  const toggleChoice = (choice: string) => {
    if (selectedChoices.includes(choice)) {
      setSelectedChoices(selectedChoices.filter((c) => c !== choice));
    } else {
      setSelectedChoices([...selectedChoices, choice]);
    }
  };

  const renderChoice = ({ item }: { item: string }) => {
    const isSelected = selectedChoices.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleChoice(item)}
        activeOpacity={1}
        style={{ flex: 1 }}
        className={`py-7 items-center rounded-2xl border-2 bg-secondary-500 ${
          isSelected ? "border-primary-500" : "border-transparent"
        }`}
      >
        <Image source={imageMap[item]}  className="h-20 w-20"/>
        <Text
          className={`text-base font-brsegma-500 text-primary-600
          }`}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const next = async() => {
    try {
      await profileContext?.setProfileData({
        ...profileContext.profileData,
        dietaryRequirements: selectedChoices,
      });
      router.push("/register/allergies");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  }

  console.log("profileContext personal:", profileContext?.profileData);

  return (
    <SafeAreaView className="bg-secondary-400 flex-1">
      <View className="h-full w-full flex-col gap-4 px-6 py-6">
        <TouchableOpacity
          className="self-start pr-2 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-1 mb-4">
          <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
          <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
          <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
          <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
          <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
        </View>
        <View className="items-center mb-2">
          <Text className="text-3xl text-primary-500 font-fogsta text-center">
            Are there any dietary requirements?
          </Text>
          <Text className="text-gray-500 mt-2 text-center font-brsegma-500">
            Choose as many that apply.
          </Text>
        </View>
        <View className="flex flex-col justify-between flex-1">
        <FlatList
          data={choices}
          renderItem={renderChoice}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{
            gap: 12,
            paddingTop: 12,
          }}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
        <TouchableOpacity
          className="bg-primary-500 rounded-full self-center py-4 px-10"
          onPress={next}
        >
          <Text className="text-white text-center font-brsegma-600 ">
            Next
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Personal;
