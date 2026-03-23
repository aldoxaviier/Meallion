import { View, Text, TouchableOpacity, FlatList,Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { ProfileDataContext } from "../store/profileDataContext";
import { api } from "../utils/api";
const DietaryRequirements = () => {
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
  const profileDataContext = useContext(ProfileDataContext);

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

  useEffect(() => {
    setSelectedChoices(profileDataContext?.profileData?.diet_preferences || []);
  }, []);

  const onSave = async() => {
    try {
      const response: any = await api.put('/profile/updateDietPreferences', { diet_preferences: selectedChoices });
        if (response.statusCode === 200 && profileDataContext?.profileData) {
            await profileDataContext.setProfileData({
                ...profileDataContext.profileData,
                diet_preferences: selectedChoices,
            });
        }
    } catch (err) {
      console.error("Navigation error:", err);
    }
  }

  return (
    <View className="bg-secondary-400 flex-1 pb-6">
      <View className="h-full w-full flex-col gap-4 px-6 py-6 ">
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
          onPress={onSave}
        >
          <Text className="text-white text-center font-brsegma-600 ">
            Save
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DietaryRequirements;
