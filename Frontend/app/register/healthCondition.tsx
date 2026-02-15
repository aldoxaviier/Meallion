import { View,Text,TouchableHighlight,TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { ProfileContext } from "../store/profileContext";
import { RegisterContext } from "../store/registerContext";

const healthConditions = () => {
    const router = useRouter();
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
    const profileContext = useContext(ProfileContext);
    const registerContext = useContext(RegisterContext);

    const conditions = [
        { id: "diabetes", label: "Diabetes" },
        { id: "blood-pressure", label: "Blood Pressure" },
        { id: "cholesterol", label: "Cholesterol" }
    ];

    const selectCondition = (conditionId: string) => {
        setSelectedCondition(conditionId === selectedCondition ? null : conditionId);
    };

    const handleNext = async () => {
        try {
            await profileContext?.setProfileData({
                ...profileContext.profileData,
                healthCondition: selectedCondition ? selectedCondition : "",
            });
            router.push('/register/allergies');
        } catch (err) {
            console.error("Error saving health conditions:", err);
            router.push('/register/allergies');
        }
    };

    return (
        <>
        <SafeAreaView className="bg-secondary-400 flex-1">
            <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                </View>
                <View className="flex flex-col justify-between flex-1">
                    <View className="flex flex-col gap-4">
                        <View className="flex flex-col gap-2">
                            <Text className="text-4xl font-fogsta text-primary-500 text-center">Tailored for Your Well-Being</Text>
                            <Text className="text-center font-brsegma-500 text-base">Let us know if you'd like meal recommendations aligned with diabetes, blood pressure, or cholesterol considerations.</Text>
                        </View>
                        <View className="flex flex-col gap-3 mt-4">
                            {conditions.map((condition) => (
                                <TouchableOpacity
                                    key={condition.id}
                                    className="flex flex-row items-center gap-3 py-4 px-4 bg-white rounded-xl"
                                    onPress={() => selectCondition(condition.id)}
                                >
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                                        selectedCondition === condition.id
                                            ? 'border-primary-500' 
                                            : 'border-gray-400'
                                    }`}>
                                        {selectedCondition === condition.id && (
                                            <View className="w-3 h-3 rounded-full bg-primary-500" />
                                        )}
                                    </View>
                                    <Text className="text-lg font-brsegma-500">{condition.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity className="py-4 px-10 self-center rounded-full bg-primary-500" onPress={handleNext}>
                        <Text className="text-center font-brsegma-600 text-secondary-400 ">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}

export default healthConditions;