import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const Index = () => {
    const [themeEnabled, setThemeEnabled] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const router = useRouter();
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
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3">
                            <View className="flex-row items-center">
                                <Ionicons name="language" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Language</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-gray-500 mr-2">English</Text>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </View>
                        </TouchableOpacity>
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
                        
                        <View className="flex-row items-center justify-between px-4 py-3">
                            <View className="flex-row items-center">
                                <Ionicons name="mail" size={20} color="#3E0703" />
                                <View className="ml-3">
                                    <Text className="text-base font-brsegma-500">Email Notification</Text>
                                    <Text className="text-xs text-gray-500 font-brsegma-300">Get email notifications</Text>
                                </View>
                            </View>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
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
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Ionicons name="person" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Personal details</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Ionicons name="restaurant" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Dietary requirements</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3">
                            <View className="flex-row items-center">
                                <Ionicons name="warning" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Dislikes & allergies</Text>
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
                        onPress={() => router.push('/profile/settings/profile')}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="person-circle" size={20} color="#3E0703" />
                                <Text className="ml-3 text-base font-brsegma-500">Profile</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3">
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