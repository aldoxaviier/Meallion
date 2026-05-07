import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
const SocialHeader = ({ onPressBtn, onSearchPress }: { onPressBtn: (tab: string) => void; onSearchPress: () => void }) => {
    const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const searchIconColor = isDark ? '#eddca1' : '#660B05';
    const handleTabPress = (tab: "foryou" | "following") => {
        setActiveTab(tab);
        if (onPressBtn) {
            onPressBtn(tab); 
        }
    }
    return (
        <>
        <SafeAreaView  className="bg-secondary-400 dark:bg-surface-dark" edges={['top']}>
        <View className="w-full pt-4 flex gap-4 ">
            <View className="flex flex-row justify-between px-6">
                <View className="flex-row justify-between items-center h-12">
                    <Text className="text-4xl text-primary-500 dark:text-secondary-400 font-fogsta">
                        Socials
                    </Text>
                </View>
                <TouchableOpacity onPress={onSearchPress}>
                    <FontAwesome5 name="search" size={24} color={searchIconColor} />
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-center items-center gap-8 pt-2 border-b-[0.5px] border-gray-400 px-6">
            <TouchableOpacity onPress={() => handleTabPress("foryou")}>
                <Text className={`text-lg font-brsegma-600 ${activeTab === "foryou" ? "text-primary-500 dark:text-secondary-400" : "text-gray-400"}`}>
                For You
                </Text>
                {activeTab === "foryou" && <View className="h-1 bg-primary-500 rounded-lg" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress("following")}>
                <Text className={`text-lg font-brsegma-600 ${activeTab === "following" ? "text-primary-500 dark:text-secondary-400" : "text-gray-400"}`}>
                Following
                </Text>
                {activeTab === "following" && <View className="h-1 bg-primary-500 rounded-lg" />}
            </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
        </>
    );
};

export default SocialHeader;