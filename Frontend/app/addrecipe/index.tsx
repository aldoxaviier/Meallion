import { router } from "expo-router";
import { View,Text, TextInput,TouchableOpacity, Alert,Image} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../store/addRecipeContext";
import * as ImagePicker from 'expo-image-picker';
import { ProfileDataContext } from "../store/profileDataContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { recipeSchema } from "../utils/validation";
import { TimerPickerModal } from "react-native-timer-picker";
import { set } from "date-fns";

interface ConfirmButtonProps {
    label : string;
    onPress?: () => void;
}

const Index = () => {
    const recipeContext = useContext(RecipeContext);
    const [inputs, setInputs] = useState({
        name: "",
        cookTime: "",
        prepTime: "",
        description: "",
    });
    const [image, setImage] = useState({
        uri: '',
        name: '',
        type: '',
    });
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const profileContext = useContext(ProfileDataContext);
    const [message, setMessage] = useState("");
    const [showPrepPicker, setShowPrepPicker] = useState(false);
    const [showCookPicker, setShowCookPicker] = useState(false);
    const url = process.env.EXPO_PUBLIC_API_URL;

    const minutesToDuration = (value: string) => {
        const totalMinutes = Number(value) || 0;
        return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
        };
    };

    const durationToMinutes = (hours: number, minutes: number) => (hours * 60) + minutes;

    const formatDurationLabel = (minutes: string, placeholder: string) => {
        const totalMinutes = Number(minutes) || 0;

        if (totalMinutes <= 0) {
            return placeholder;
        }

        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        if (hours > 0 && remainingMinutes > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }

        if (hours > 0) {
            return `${hours}h`;
        }

        return `${remainingMinutes}m`;
    };
    

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
        });

        console.log(result);

        if (!result.canceled) {
            setImage({
                uri: result.assets[0].uri,
                name: result.assets[0].fileName as any,
                type: result.assets[0].mimeType as any,
            });
            setDisplayImage(result.assets[0].uri);
            recipeContext?.setRecipeData({ ...recipeContext.recipeData, image: {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName as any,
                type: result.assets[0].mimeType as any,
            } });
        }
    };

    useEffect(() => {
        console.log("Current Recipe Context Data:", inputs);
    },[inputs])

    const onPressNext = async () => {
        try {
            const recipePayload = {
                name: inputs.name,
                cookTime: parseInt(inputs.cookTime),
                prepTime: parseInt(inputs.prepTime),
                description: inputs.description,
                image:{
                    uri: image.uri,
                    name: image.name,
                    type: image.type,
                },
            };
            await recipeSchema.validate(recipePayload);
            recipeContext?.setRecipeData((prev) => ({ ...prev, ...recipePayload }));
            setMessage("");
            router.push("/addrecipe/category");           
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "An unknown error occurred during validation.");
        }

    };
    const ButtonComponent = ({ onPress, label }: ConfirmButtonProps) => {
        return(
            <TouchableOpacity onPress={onPress} className="px-8 py-4 rounded-2xl bg-primary-500">
                <Text className="font-brsegma-500 text-secondary-400">{label}</Text>
            </TouchableOpacity>
        );
    }
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
                            <TextInput 
                                placeholder="Recipe name" 
                                placeholderTextColor="#9CA3AF" 
                                className="bg-white border-y border-gray-200 px-6 font-brsegma-500"
                                value={inputs.name}
                                onChangeText={(text) => setInputs(prev => ({ ...prev, name: text }))}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPrepPicker(true)}
                                className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center"
                            >
                                <Text className={`font-brsegma-500 ${inputs.prepTime ? "text-gray-700" : "text-[#9CA3AF]"}`}>
                                    {formatDurationLabel(inputs.prepTime, "Prep time")}
                                </Text>
                                <FontAwesome name="clock-o" size={20} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setShowCookPicker(true)}
                                className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center"
                            >
                                <Text className={`font-brsegma-500 ${inputs.cookTime ? "text-gray-700" : "text-[#9CA3AF]"}`}>
                                    {formatDurationLabel(inputs.cookTime, "Cook time")}
                                </Text>
                                <FontAwesome name="clock-o" size={20} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                            <View className="bg-white border-b border-gray-200 px-6 py-3 flex-row">
                                <Text className="font-brsegma-500 text-[#9CA3AF]">Photo</Text>
                                <TouchableOpacity onPress={pickImage} className="ml-auto">
                                    {displayImage ? (
                                        <View className="h-12 w-12 overflow-hidden">
                                            <Image source={{ uri: displayImage }} style={{ width: '100%', height: '100%' }} />
                                        </View>
                                    ) : (
                                        <FontAwesome name="camera" size={20} color="#9CA3AF" />
                                    )}

                                </TouchableOpacity>
                            </View>
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
                            value={inputs.description}
                            onChangeText={(text) => setInputs(prev => ({ ...prev, description: text }))}
                            className="mt-3 h-80 rounded-2xl border border-gray-300 bg-white px-4 py-4 text-base font-brsegma-500 text-gray-700 shadow-none"
                        />
                    </View>
                </View>
                {message ? (
                    <Text className="text-red-700 text-center font-brsegma-500">{message}</Text>
                ) : null}

                <TimerPickerModal
                    visible={showPrepPicker}
                    setIsVisible={setShowPrepPicker}
                    modalTitle="Select Prep Time"
                    hideSeconds
                    hideDays
                    confirmButton={<ButtonComponent label="Confirm" />}
                    initialValue={minutesToDuration(inputs.prepTime)}
                    onCancel={() => setShowPrepPicker(false)}
                    onConfirm={({ hours, minutes }) => {
                        setInputs((prev) => ({
                            ...prev,
                            prepTime: String(durationToMinutes(hours, minutes)),
                        }));
                        setShowPrepPicker(false);
                    }}
                    styles={{
                        contentContainer: {
                            width: 300,        // increase from default ~220
                            paddingHorizontal: 24,
                        },
                        pickerContainer: {
                            width: '100%',
                        },
                        pickerLabelGap: { hours: 10, minutes: 8 },
                    }}
                />

                <TimerPickerModal
                    visible={showCookPicker}
                    setIsVisible={setShowCookPicker}
                    modalTitle="Set Cook Time"
                    hideSeconds
                    hideDays
                    initialValue={minutesToDuration(inputs.cookTime)}
                    onCancel={() => setShowCookPicker(false)}
                    confirmButton={<ButtonComponent label="Confirm" />}
                    onConfirm={({ hours, minutes }) => {
                        setInputs((prev) => ({
                            ...prev,
                            cookTime: String(durationToMinutes(hours, minutes)),
                        }));
                        setShowCookPicker(false);
                    }}
                    styles={{
                        contentContainer: {
                            width: 300,        // increase from default ~220
                            paddingHorizontal: 24,
                        },
                        pickerContainer: {
                            width: '100%',
                        },
                        pickerLabelGap: { hours: 10, minutes: 8 },
                    }}
                />

                <TouchableOpacity
                    className="py-4 px-10 self-center rounded-full bg-primary-500"
                    onPress={onPressNext}
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