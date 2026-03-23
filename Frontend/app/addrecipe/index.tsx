import { router } from "expo-router";
import { View,Text, TextInput,TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
const Index = () => {
    return (
        <>
        <SafeAreaView className="flex-1" edges={['bottom']}>
            <View className="flex-1 justify-between pb-12">
                <View className="flex gap-10">
                    <View className="flex gap-2 pt-8">
                        <View className="px-6">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Recipe Details</Text>
                        </View>
                        <View className="gap-[1px]">
                            <TextInput placeholder="Recipe name" placeholderTextColor="#9CA3AF" className="bg-white border-y border-gray-200 px-6 font-brsegma-500"/>
                            <TextInput placeholder="Prep time" placeholderTextColor="#9CA3AF" className="bg-white border-b border-gray-200 px-6 font-brsegma-500"/>
                            <TextInput placeholder="Cook time" placeholderTextColor="#9CA3AF" className="bg-white border-b border-gray-200 px-6 font-brsegma-500"/>
                            <TextInput placeholder="Photo" placeholderTextColor="#9CA3AF" className="bg-white border-b border-gray-200 px-6 font-brsegma-500"/>
                        </View>
                    </View>
                    <View className="px-6">
                        <View >
                            <Text className="text-xl font-brsegma-600 text-primary-500">Description</Text>
                        </View>
                        <TextInput
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                            placeholder="Tell us what makes this recipe special..."
                            placeholderTextColor="#9CA3AF"
                            className="mt-3 h-80 rounded-2xl border border-gray-300 bg-white px-4 py-4 text-base font-brsegma-500 text-gray-700 shadow-none"
                        />
                    </View>
                </View>
                <TouchableOpacity
                    className="py-4 px-10 self-center rounded-full bg-primary-500"
                    onPress={()=>router.push('/addrecipe/ingredients')}
                    >
                    <Text className="text-center font-brsegma-600 text-secondary-400">
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </>
    )
}

export default Index