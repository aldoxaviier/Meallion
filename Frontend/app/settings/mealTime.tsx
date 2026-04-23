import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TimerPickerModal } from "react-native-timer-picker";
import { api } from "../utils/api";
import { ProfileDataContext } from "../store/profileDataContext";

const MealTime = () => {
    const [breakfastTime, setBreakfastTime] = useState("07:00:00");
    const [lunchTime, setLunchTime] = useState("12:30:00");
    const [snackTime, setSnackTime] = useState("15:00:00");
    const [dinnerTime, setDinnerTime] = useState("19:00:00");
    const [isSaving, setIsSaving] = useState(false);
    const profileDataContext = useContext(ProfileDataContext);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currentMeal, setCurrentMeal] = useState<string | null>(null);

    const parseTime = (timeString: string) => {
        if (!timeString) return { hours: 7, minutes: 0 };
        const cleanTime = timeString.trim(); 
        const [hours, minutes] = cleanTime.split(':');
        return { 
            hours: parseInt(hours, 10) || 0, 
            minutes: parseInt(minutes, 10) || 0
        };
    };

    const formatTime = (hours: number, minutes: number) => {
        const paddedHrs = hours < 10 ? `0${hours}` : hours;
        const paddedMins = minutes < 10 ? `0${minutes}` : minutes;
        const paddedSecs = "00";
        return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const response: any = await api.put('/profile/updateProfile', { breakfast_time: breakfastTime, lunch_time: lunchTime, snack_time: snackTime, dinner_time: dinnerTime });
            if (response.statusCode === 200 && profileDataContext?.profileData) {
                await profileDataContext.setProfileData({
                    ...profileDataContext.profileData,
                    breakfast_time: breakfastTime,
                    lunch_time: lunchTime,
                    snack_time: snackTime,
                    dinner_time: dinnerTime,
                });
            }
        } catch (error) {
            console.error("Error saving meal times:", error);
            Alert.alert("Error", "An error occurred while saving. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleTimePress = (meal: string) => {
        setCurrentMeal(meal);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setCurrentMeal(null);
    };

    const handleConfirm = (pickedDuration: any) => {
        const formattedTime = formatTime(pickedDuration.hours, pickedDuration.minutes);
        
        if (currentMeal === "breakfast") setBreakfastTime(formattedTime);
        else if (currentMeal === "lunch") setLunchTime(formattedTime);
        else if (currentMeal === "snack") setSnackTime(formattedTime);
        else if (currentMeal === "dinner") setDinnerTime(formattedTime);
        
        hideDatePicker();
    };

    const getInitialTime = () => {
        if (currentMeal === "breakfast") return parseTime(breakfastTime);
        if (currentMeal === "lunch") return parseTime(lunchTime);
        if (currentMeal === "snack") return parseTime(snackTime);
        if (currentMeal === "dinner") return parseTime(dinnerTime);
        return { hours: 7, minutes: 0 };
    };

    const initialTime = getInitialTime();

    const fetchMealTimes = async () => {
        try {
            const response = await api.get('profile/getMealTimes');
            const { breakfast_time, lunch_time, snack_time, dinner_time } = response.data;
            
            if(breakfast_time) setBreakfastTime(breakfast_time);
            if(lunch_time) setLunchTime(lunch_time);
            if(snack_time) setSnackTime(snack_time);
            if(dinner_time) setDinnerTime(dinner_time);
        } catch (error) {
            console.error("Failed to fetch meal times:", error);
        }
    };

    useEffect(() => {
        fetchMealTimes();
    }, []);

    const MealTimeRow = ({ title, time, iconName, onPress }: { title: string, time: string, iconName: any, onPress: () => void }) => (
        <View className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-4 shadow-sm">
            <View className="flex-row items-center">
                <View className="bg-secondary-400/30 p-2 rounded-full mr-4">
                    <Ionicons name={iconName} size={24} color="#3E0703" />
                </View>
                <Text className="text-lg font-brsegma-500 text-gray-900">{title}</Text>
            </View>
            <TouchableOpacity 
                className="bg-gray-100 px-4 py-2 rounded-lg w-1/3 items-center justify-center"
                onPress={onPress}
            >
                <Text className="text-base font-brsegma-500 text-primary-500">{time}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-secondary-400">
            <ScrollView className="flex-1 px-6 pt-6">
                <MealTimeRow 
                    title="Breakfast" 
                    time={breakfastTime} 
                    iconName="partly-sunny" 
                    onPress={() => handleTimePress("breakfast")} 
                />
                <MealTimeRow 
                    title="Lunch" 
                    time={lunchTime} 
                    iconName="sunny" 
                    onPress={() => handleTimePress("lunch")} 
                />
                <MealTimeRow 
                    title="Snacks" 
                    time={snackTime} 
                    iconName="pizza" 
                    onPress={() => handleTimePress("snack")} 
                />
                <MealTimeRow 
                    title="Dinner" 
                    time={dinnerTime} 
                    iconName="moon" 
                    onPress={() => handleTimePress("dinner")} 
                />
            </ScrollView>

            <View className="px-6 py-4 bg-secondary-400">
                <TouchableOpacity
                    className={`py-4 px-10 self-center rounded-full w-full ${isSaving ? 'bg-primary-500/70' : 'bg-primary-500'}`}
                    onPress={handleSave}
                    disabled={isSaving}>
                    <Text className="text-center font-brsegma-500 text-secondary-400 text-lg">
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TimerPickerModal
                key={currentMeal || 'timer-modal'}
                visible={isDatePickerVisible}
                setIsVisible={setDatePickerVisibility}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                modalTitle={`Set ${currentMeal ? currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1) : ''} Time`}
                closeOnOverlayPress
                use12HourPicker={false}
                hideSeconds={true}
                initialValue={{
                    hours: initialTime.hours,
                    minutes: initialTime.minutes,
                    seconds: 0
                }}
                styles={{
                    contentContainer: styles.timePickerModalContainer
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    timePickerModalContainer: {
        width: '90%',
        paddingHorizontal: 20,
    }
});

export default MealTime;