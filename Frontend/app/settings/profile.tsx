import { View, Image, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useRef, useMemo, useCallback, useContext, useEffect } from "react";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from 'expo-image-picker';
import { ProfileDataContext } from "../store/profileDataContext";
import { WheelPicker, ITEM_HEIGHT } from "../components/WheelPicker";
import { api } from "../utils/api";

const goalOptions = ['Lose weight', 'Maintain weight', 'Gain weight'];


const Profile = () => {
    const [goal, setGoal] = useState('');
    const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);
    const [image, setImage] = useState({
        uri: '',
        name: '',
        type: '',
    });
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["30%"], []);
    const profileContext = useContext(ProfileDataContext);
    const [updatefields, setUpdateFields] = useState({
        name: '',
        bio: '',
        weight: 0,
        height: 0,
        goal_plan: ''
    });
    const url = process.env.EXPO_PUBLIC_API_URL;
    const [displayImage, setDisplayImage] = useState<string | null>(null);

    const renderBackdrop = useCallback((props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
            opacity={0.6}
        />
    ), []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access the media library is required.');
        return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        shape: 'oval',
        });

        console.log(result);

        if (!result.canceled) {
            setImage({
                uri: result.assets[0].uri,
                name: result.assets[0].fileName as any,
                type: result.assets[0].mimeType as any,
            });
            setDisplayImage(result.assets[0].uri);
        }
    };

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    const handleConfirmGoal = () => {
        const selectedGoalValue = goalOptions[selectedGoalIndex];
        setGoal(selectedGoalValue);
        setUpdateFields({...updatefields, goal_plan: selectedGoalValue});
        closeBottomSheet();
    };

    const getPicture = async () => {
        if(profileContext?.profileData?.profile_image){
            const imageUrl = `${url}/${profileContext.profileData.profile_image}`;
            setDisplayImage(imageUrl);
        }
    }

    useEffect(() => {
        console.log('image state updated:', image);
        console.log('displayImage state:', displayImage);
    }, [image]);



    useEffect(() => {
        if (profileContext?.profileData) {
            const goalFromProfile = profileContext.profileData.goal_plan;
            const goalIndex = goalOptions.indexOf(goalFromProfile);
            
            setUpdateFields({
                name: profileContext.profileData.users.name,
                bio: profileContext.profileData.bio,
                weight: profileContext.profileData.weight ,
                height: profileContext.profileData.height,
                goal_plan: goalFromProfile,
            });
            if (goalIndex !== -1) {
                setSelectedGoalIndex(goalIndex);
                setGoal(goalFromProfile);
            }
            if(!displayImage){
                getPicture();
            }
        }
    }, [profileContext?.profileData]);

    const onSave = async () => {
        const formdata = new FormData();
        if(image.uri){
            formdata.append("image", {
                uri: image.uri,
                name: image.name,
                type: image.type,
            } as any);
        }
        Object.keys(updatefields).forEach((key) => {
            const value = updatefields[key as keyof typeof updatefields];
            formdata.append(key, String(value));
        });
        try {
            const response:any = await api.put('/profile/updateProfile', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile updated successfully:', response.data);
            profileContext?.setProfileData(response.data[0]);
        } catch (err) {
            console.error('Error saving profile:', err);
            Alert.alert('Error', 'An error occurred while saving your profile. Please try again.');
        }
    }

    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-secondary-400 pb-6">
                <ScrollView className="flex-1 px-6">
                    <View className="w-full flex items-center justify-center pt-8 pb-6 gap-2">
                        <Image
                            className="w-24 h-24 rounded-full"
                            source={displayImage ? { uri: displayImage } : require('../../assets/images/android-icon-background.png')}
                        />
                        <TouchableOpacity className="" onPress={pickImage}>
                            <Text className="text-base font-brsegma-600 text-primary-500">CHANGE AVATAR</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex gap-4">
                        <View className="flex gap-1">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Name</Text>
                            <TextInput className="bg-white w-full font-brsegma-500 rounded-lg p-4" placeholder="Name" value={updatefields.name} onChangeText={(text) => setUpdateFields({...updatefields, name: text})}/>
                        </View>
                        <View className="flex gap-1">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Bio</Text>
                            <TextInput 
                                className="bg-white w-full font-brsegma-500 rounded-lg p-4" 
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#9ca3af"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={updatefields.bio}
                                onChangeText={(text) => setUpdateFields({...updatefields, bio: text})}
                            />
                        </View>
                        <View className="flex gap-1">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Weight</Text>
                            <TextInput 
                                className="bg-white w-full font-brsegma-500 rounded-lg p-4" 
                                placeholder="Weight in kg"
                                keyboardType="numeric"
                                inputMode="numeric"
                                value={updatefields.weight ? updatefields.weight.toString() : ''}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setUpdateFields({...updatefields, weight: numericValue ? parseInt(numericValue) : 0});
                                }}
                            />
                        </View>
                        <View className="flex gap-1">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Height</Text>
                            <TextInput 
                                className="bg-white w-full font-brsegma-500 rounded-lg p-4" 
                                placeholder="Height in cm"
                                keyboardType="numeric"
                                inputMode="numeric"
                                value={updatefields.height ? updatefields.height.toString() : ''}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setUpdateFields({...updatefields, height: numericValue ? parseInt(numericValue) : 0});
                                }}
                            />
                        </View>
                        <View className="flex gap-1">
                            <Text className="text-xl font-brsegma-600 text-primary-500">Goal</Text>
                            <TouchableOpacity onPress={openBottomSheet}>
                                <View className="bg-white w-full rounded-lg p-4 flex-row justify-between items-center">
                                    <Text className={`font-brsegma-500 ${goal ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {goal || 'Select goal'}
                                    </Text>
                                    <Feather name="chevron-down" size={20} color="#6b7280" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View className="px-6 py-4 bg-secondary-400">
                    <TouchableOpacity
                        className="py-4 px-10 self-center rounded-full bg-primary-500"
                        onPress={onSave}
                        >
                        <Text className="text-center font-brsegma-600 text-secondary-400">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
                backdropComponent={renderBackdrop}
                handleStyle={{ display: 'none' }}
                
            >
                <BottomSheetView className="flex-1">
                    <View className="flex-row justify-between w-full items-center px-6 py-4 border-b-1 border-gray-200">
                        <TouchableOpacity onPress={closeBottomSheet}>
                            <Text className="font-brsegma-500">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirmGoal}>
                            <Text className="font-brsegma-600 text-primary-500">Done</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="items-center justify-center flex-1">
                        {/* Selection highlight - green pill */}
                        <View 
                            className="absolute bg-primary-500 rounded-full z-0"
                            style={{ 
                                height: ITEM_HEIGHT, 
                                width: '85%',
                            }}
                        />
                        
                        {/* Wheel picker */}
                        <View className="z-10 " style={{ width: '85%' }}>
                            <WheelPicker
                                data={goalOptions}
                                selectedIndex={selectedGoalIndex}
                                onSelect={setSelectedGoalIndex}
                            />
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

export default Profile;