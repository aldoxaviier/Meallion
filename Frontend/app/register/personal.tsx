import { View, Text, TouchableOpacity, FlatList,Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";

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
        activeOpacity={0.8}
        style={{ flex: 1 }}
        className={`py-8 items-center rounded-2xl  ${
          isSelected ? "border-primary-500 bg-primary-100" : "bg-[#fcfaf3]"
        }`}
      >
        <Image source={require('../../assets/images/pork.png')}  className="h-20 w-20"/>
        <Text
          className={`text-base font-brsegma-500 ${
            isSelected ? "text-primary-600" : "text-primary-400"
          }`}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-1 flex-col gap-4 px-6 py-6">
        {/* Back button */}
        <TouchableOpacity
          className="self-start pr-2 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Progress bar */}
        <View className="flex flex-row gap-1 mb-4">
          <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
          <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
          <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
          <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
        </View>

        {/* Title */}
        <View className="items-center mb-2">
          <Text className="text-3xl text-primary-500 font-fogsta text-center">
            Are there any dietary requirements?
          </Text>
          <Text className="text-gray-500 mt-2 text-center font-brsegma-500">
            Choose as many that apply.
          </Text>
        </View>

        {/* Choice grid */}
        <FlatList
          data={choices}
          renderItem={renderChoice}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{
            gap: 12,
            paddingTop: 12,
            paddingBottom: 32,
          }}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />

        {/* Next button */}
        <TouchableOpacity
          className="bg-primary-500 py-4 rounded-full mt-auto"
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-white text-center font-brsegma-600 text-lg">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Personal;
