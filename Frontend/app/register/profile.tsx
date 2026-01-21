import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { Asset } from "expo-asset";
import { Dropdown } from 'react-native-element-dropdown';
import { ProfileContext } from "../store/profileContext";
import { profileSchema } from "../utils/validation";

const profile = () => {
    const router = useRouter();
    const [height, setHeight] = useState<any>(undefined);
    const [weight, setWeight] = useState<any>(undefined);
    const [activity, setActivity] = useState<any>(undefined);
    const [goal, setGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const profileContext = useContext(ProfileContext);

    const activityOptions = [
        { label: 'Sedentary (little/no exercise)', value: 1.2 },
        { label: 'Lightly active (1-3 days/week)', value: 1.375 },
        { label: 'Moderately active (3-5 days/week)', value: 1.55 },
        { label: 'Very active (6-7 days/week)', value: 1.725 },
        { label: 'Extra active (very hard exercise)', value: 1.9 },
    ];

    const goalOptions = [
        { label: 'Lose weight', value: 'Lose weight' },
        { label: 'Maintain weight', value: 'Maintain weight' },
        { label: 'Gain weight', value: 'Gain weight' },
    ];

    const next = async() => {
        setIsLoading(true);
        try {
            const response = await profileSchema.validate({height: height, weight: weight, activity: activity, goal: goal},{abortEarly: false});
            profileContext?.setProfileData({height: height, weight: weight, activity: activity, goal: goal});
            router.push('/register/personal');
        } catch (err:any) {
            console.error('Error submitting profile:', err);
            setMessage(err.errors[0]);
        }
    }

    useEffect(() => {
        console.log("height:", height);
        console.log("weight:", weight);
        console.log("activity:", activity);
        console.log("goal:", goal);
    }, [height, weight, activity, goal]);

    return (
        <>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView className="bg-secondary-400 flex-1">
            <View className="bg-secondary-400 h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                </View>
                <View className="flex flex-col flex-1 gap-10">
                    <View className="flex flex-col gap-2">
                        <Text className="text-4xl font-fogsta text-primary-500 text-center">Enjoy planning your meal with Meallion</Text>
                    </View>
                    <View className="flex flex-col justify-between flex-1">
                        <View className="flex flex-col gap-3">
                            <View>
                            <Text className="text-lg font-brsegma-600">Height (cm)</Text>
                            <TextInput
                                value={height}
                                onChangeText={setHeight}
                                placeholder="e.g. 170"
                                keyboardType="numeric"
                                className="w-full border text-lg border-gray-400 rounded-xl px-4 py-4 font-brsegma-500"
                            />
                            </View>
                            <View>
                            <Text className="text-lg font-brsegma-600">Weight (kg)</Text>
                            <TextInput
                                value={weight}
                                onChangeText={setWeight}
                                placeholder="e.g. 70"
                                keyboardType="numeric"
                                className="w-full border text-lg  border-gray-400 rounded-xl px-4 py-4 font-brsegma-500"
                            />
                            </View>
                            <View>
                            <Text className="text-lg font-brsegma-600">Activity Level</Text>
                            <Dropdown
                                data={activityOptions}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder="Select activity level"
                                value={activity}
                                onChange={item => setActivity(item.value)}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemContainerStyle={styles.containerItem}
                                containerStyle={styles.dropdownStyle}
                                iconStyle={styles.iconStyle}
                                activeColor="#660B05"
                                renderItem={(item) => (
                                    <View className="py-6 px-4">
                                        <Text style={{ color: item.value === activity ? '#F2E8C6' : '#111827', fontFamily: 'BRSegma-500' }}>{item.label}</Text>
                                    </View>
                                )}

                            />
                            </View>
                            <View>
                            <Text className="text-lg font-brsegma-600 ">Goal Plan</Text>
                            <Dropdown
                                data={goalOptions}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder="Select goal"
                                value={goal}
                                onChange={item => setGoal(item.value)}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemContainerStyle={styles.containerItem}
                                containerStyle={styles.dropdownStyle}
                                iconStyle={styles.iconStyle}
                                activeColor="#660B05"
                                renderItem={(item) => (
                                    <View className="py-6 px-4">
                                        <Text style={{ color: item.value === goal ? '#F2E8C6' : '#111827', fontFamily: 'BRSegma-500' }}>{item.label}</Text>
                                    </View>
                                )}
                            />
                            </View>
                            {message ? (
                                <Text className="text-red-500 text-center text-sm font-brsegma-600 mb-4">
                                    {message}
                                </Text>
                            ) : null}
                        </View>
                    <TouchableOpacity
                        className={`py-4 px-10 self-center rounded-full bg-primary-500 `}
                        onPress={next}
                    >
                        <Text className="text-center font-brsegma-600 text-secondary-400">Next</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
        </>
    );
}


export default profile;

const styles = StyleSheet.create({
    dropdown: {
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#9ca3af',
    },
    placeholderStyle: {
        fontFamily: 'BRSegma-500',
        fontSize: 16,
        color: '#6b7280'
    },
    selectedTextStyle: {
        color: '#111827',
        fontFamily: 'BRSegma-500',
    },
    dropdownStyle: {
        backgroundColor: '#ffffff',
        borderBottomStartRadius: 12,
        borderBottomEndRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    item: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    itemText: {
        color: '#111827'
    },
    iconStyle: {
        width: 20,
        height: 20,
        tintColor: '#6b7280'
    },
    containerItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    }
});