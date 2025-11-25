import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Asset } from "expo-asset";
import { Dropdown } from 'react-native-element-dropdown';
const profile = () => {
    const router = useRouter();
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState(null);
    const [goal, setGoal] = useState(null);

    const activityOptions = [
        { label: 'Sedentary (little/no exercise)', value: '1.2' },
        { label: 'Lightly active (1-3 days/week)', value: '1.375' },
        { label: 'Moderately active (3-5 days/week)', value: '1.55' },
        { label: 'Very active (6-7 days/week)', value: '1.725' },
        { label: 'Extra active (very hard exercise)', value: '1.9' },
    ];

    const goalOptions = [
        { label: 'Lose weight', value: 'lose' },
        { label: 'Maintain weight', value: 'maintain' },
        { label: 'Gain weight', value: 'gain' },
    ];

    const canProceed = height.trim() !== '' && weight.trim() !== '' && activity && goal;

    return (
        <>
        <SafeAreaView className="bg-secondary-200 flex-1">
            <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
                <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex flex-row gap-1 mb-4">
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                    <View className="h-1 flex-1 bg-gray-300 rounded-full"></View>
                </View>
                <View className="flex flex-col flex-1 gap-10">
                    <View className="flex flex-col gap-2">
                        <Text className="text-4xl font-fogsta text-primary-500 text-center">Enjoy planning your meal with Meallion</Text>
                    </View>
                    <View className="flex flex-col justify-between flex-1">
                        <ScrollView>

                            <Text className="text-lg font-brsegma-600">Height (cm)</Text>
                            <TextInput
                                value={height}
                                onChangeText={setHeight}
                                placeholder="e.g. 170"
                                keyboardType="numeric"
                                className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500"
                            />

                            <Text className="text-lg font-brsegma-600">Weight (kg)</Text>
                            <TextInput
                                value={weight}
                                onChangeText={setWeight}
                                placeholder="e.g. 70"
                                keyboardType="numeric"
                                className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500"
                            />

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
                                
                                iconStyle={styles.iconStyle}
                                renderItem={(item) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </View>
                                )}

                            />

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
                                
                                iconStyle={styles.iconStyle}
                                renderItem={(item) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </View>
                                )}
                            />
                        </ScrollView>

                    <TouchableOpacity
                        className={`py-4 px-10 self-center rounded-full ${canProceed ? 'bg-primary-500' : 'bg-gray-300'}`}
                        onPress={() => { if (canProceed) router.push('/register/personal'); }}
                        disabled={!canProceed}
                    >
                        <Text className="text-center font-brsegma-600 text-secondary-400">Next</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}


export default profile;

const styles = StyleSheet.create({
    dropdown: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#9ca3af',
    },
    placeholderStyle: {
        fontFamily: 'BRSegma-500',
        fontSize: 16,
        color: '#6b7280',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#111827'
    },
    dropdownStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    itemText: {
        fontSize: 15,
        color: '#111827'
    },
    iconStyle: {
        width: 20,
        height: 20,
        tintColor: '#6b7280'
    }
});