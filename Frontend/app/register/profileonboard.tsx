import { View,Text,TouchableHighlight,TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Asset } from "expo-asset";
const profileonboard = () => {
    const router = useRouter();
    return (
        <>
        <SafeAreaView className="bg-secondary-200 flex-1">
            <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                </View>
                <View className="flex flex-col justify-between flex-1">
                    <View className="flex flex-col gap-2">
                        <Text className="text-4xl font-fogsta text-primary-500 text-center">Enjoy planning your meal with Meallion</Text>
                        <Text className="text-center font-brsegma-500 text-base">We’re excited to have you here. Before we get started, we’ll ask a few quick questions about your preferences — like your favorite cuisines, allergies, and diet type. This helps us personalize your recommendations so you can get meals that truly fit your taste and lifestyle.</Text>
                    </View>
                    <TouchableOpacity className="py-4 px-10 self-center rounded-full bg-primary-500" onPress={() => router.push('/register/personal')}>
                        <Text className="text-center font-brsegma-600 text-secondary-400 ">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}

export default profileonboard;