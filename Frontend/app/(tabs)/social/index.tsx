import { View, Text, TextInput, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Socials() {
  return (
    <SafeAreaView className="bg-secondary-400 flex-1">
      <View className="h-full w-full px-6 pt-7 flex gap-4">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-4xl text-primary-500 font-fogsta">
            Socials
          </Text>
          <TouchableHighlight underlayColor="transparent">
            <FontAwesome5 name="bell" size={24} color="#4a2c2a" />
          </TouchableHighlight>
        </View>

        {/* Search People */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <FontAwesome5 name="search" size={20} color="gray" />
          <TextInput 
            className="flex-1 ml-3 text-base text-gray-700"
            placeholder="Search people..."
          />
        </View>

        {/* Coming Soon Content */}
        <View className="flex-1 items-center justify-center">
          <Ionicons name="people" size={80} color="#4a2c2a" />
          <Text className="text-2xl font-fogsta text-primary-500 mt-4">Coming Soon</Text>
          <Text className="text-center text-gray-500 mt-2 px-8">
            Connect with fellow food lovers, share recipes, and discover new culinary inspirations from the community.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};