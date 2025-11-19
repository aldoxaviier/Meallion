import { View,Text,TouchableHighlight,TouchableOpacity, Pressable, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import api from "../utils/api";
import { useEffect, useState } from "react";
const allergies = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
    const timeout = setTimeout(async () => {
        if (searchTerm.length >= 2) {
        await api.get(`/recipes/getAllIngredients?query=${searchTerm}`)
        }
        setResults([]);
    }, 400);
    return () => clearTimeout(timeout);
    }, [searchTerm]);

    const openModal = () => {
        setIsModalVisible(true);
    }

    return (
        <>
        <SafeAreaView className="bg-secondary-200 flex-1">
            <Modal visible={isModalVisible} animationType="slide"  onRequestClose={() => setIsModalVisible(false)}>
                <View className="h-full flex justify-center items-center">
                <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-green-400"><Text>Close</Text></TouchableOpacity>
                </View>
            </Modal>
            <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                </View>
                <View className="flex flex-col justify-between flex-1">
                    <View className="flex flex-col gap-2">
                        <Text className="text-4xl font-fogsta text-primary-500 text-center">Any dislikes or allergies?</Text>
                        <Text className="text-center font-brsegma-500">We’re excited to have you here. Before we get started, we’ll ask a few quick questions about your preferences — like your favorite cuisines, allergies, and diet type. This helps us personalize your recommendations so you can get meals that truly fit your taste and lifestyle.</Text>
                    </View>
                    <TouchableOpacity className="border border-primary-400 rounded-full py-6 px-4 flex-row items-center justify-center gap-2" onPress={openModal}><Feather name="search" size={28} color="black" className="absolute left-4"/><Text className="font-brsegma-600">Add ingredients</Text></TouchableOpacity>
                    <TouchableHighlight className="py-4 px-10 self-center rounded-full bg-primary-500" onPress={() => router.push('/register/personal')}>
                        <Text className="text-center font-brsegma-600 text-secondary-400 ">Next</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}

export default allergies;