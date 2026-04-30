import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthContext } from '../store/authContext';
import { api } from '../utils/api';
import { ProfileDataContext } from '../store/profileDataContext';
const Index = () => {
    const [themeEnabled, setThemeEnabled] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const profileContext = useContext(ProfileDataContext);

    const onPressLogout = async () => {
        try {
        const response:any = await api.get('/auth/logout',);
        console.log("Logout response:", response.data);
        if (response.statusCode === 200) {
            profileContext?.resetProfileData();
            authContext?.logout();
        }
        } catch (err) {
        console.error(err)
        }
    }

    const onPressDiateryRequirements = () => {
        router.push('/settings/dietaryRequirements' as any);
    }

    const onPressMealTime = () => {
        router.push('/settings/mealTime' as any);
    }

    const onPressDislikesAndAllergies = () => {
        router.push('/settings/dislikesandallergies' as any);
    }

    return (
        <View className="h-full bg-secondary-400 px-6">
            <ScrollView className="flex-1">
                {/* Display & Appearance Section */}
                <View className="mt-4">
                    <Text className="text-sm text-gray-600 mb-2 font-brsegma-500">DISPLAY & APPEARANCE</Text>
                    
                    <View className="bg-white rounded-lg mb-4">
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Ionicons name="moon" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Theme</Text>
                            </View>
                            <Switch
                                value={themeEnabled}
                                onValueChange={setThemeEnabled}
                                trackColor={{ false: '#E5E5E5', true: '#FF6B6B' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                {/* Notifications Section */}
                <View className="">
                    <Text className="text-sm text-gray-600 mb-2 font-brsegma-500">NOTIFICATIONS</Text>
                    
                    <View className="bg-white rounded-lg mb-4">
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Ionicons name="notifications" size={20} color="#3E0703" />
                                <View className="ml-3">
                                    <Text className="text-base font-brsegma-500">Push Notification</Text>
                                    <Text className="text-xs text-gray-500 font-brsegma-300">Allow us to sent notifications</Text>
                                </View>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#E5E5E5', true: '#FF6B6B' }}
                                thumbColor="#fff"
                            />
                        </View>
                        
                    </View>
                </View>

                {/* Personalization Section */}
                <View className="">
                    <Text className="text-sm text-gray-600 mb-2 font-brsegma-500">PERSONALIZATION</Text>
                    
                    <View className="bg-white rounded-lg mb-4">       
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100" onPress={onPressDiateryRequirements}>
                            <View className="flex-row items-center">
                                <Ionicons name="restaurant" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Dietary requirements</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3" onPress={onPressDislikesAndAllergies}>
                            <View className="flex-row items-center">
                                <Ionicons name="warning" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Dislikes & allergies</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3" onPress={onPressMealTime}>
                            <View className="flex-row items-center">
                                <Ionicons name="time" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Update My Meal Time</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Account Section */}
                <View className="">
                    <Text className="text-sm text-gray-600 mb-2 font-brsegma-500">ACCOUNT</Text>
                    
                    <View className="bg-white rounded-lg mb-4">
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
                        onPress={() => router.push('/settings/profile')}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="person-circle" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Profile</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3" onPress={onPressLogout}>
                            <View className="flex-row items-center">
                                <Ionicons name="log-out" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Sign out</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default Index;