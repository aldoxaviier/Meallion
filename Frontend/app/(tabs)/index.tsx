import api from "../utils/api";
import { Text, View, Image, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const onPressTest = async () => {
    try {
      const response = await api.get('/profile/test'); 
      console.log("Test response:", response.data); 
    } catch (error) {
      console.error("Error during test request:", error);
    }
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
              <Text className="text-primary-500 text-2xl font-fogsta">Hey,{}</Text>
              <Text className="text-primary-500 text-xs font-brsegma-500">Good Morning</Text>
            </View>
          </View>
          <View className="gap-4">
            <Text className="text-primary-500 text-2xl font-fogsta">What flavors are you{'\n'}craving today?</Text>
            <TextInput className="bg-white rounded-full" placeholder="Find Your Meal..."></TextInput>
          </View>
        </View>
        <View>
          
        </View>
    </View>
    </SafeAreaView>
    
  );
}
