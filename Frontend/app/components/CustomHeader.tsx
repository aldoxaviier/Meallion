import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
    title: string;
    onBackPress?: () => void;
}

const CustomHeader = ({ title, onBackPress }: CustomHeaderProps) => {
    const router = useRouter();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View className="flex-row items-center justify-between px-6 pt-16 bg-white border-b border-gray-200">
            <TouchableOpacity 
                onPress={handleBackPress}
                className="w-10 h-10 justify-center"
            >
                <Ionicons name="chevron-back" size={24} color="#660B05" />
            </TouchableOpacity>
            
            <Text className="text-lg font-fogsta text-primary-500 text-center flex-1 mr-10">
                {title}
            </Text>
        </View>
    );
};

export default CustomHeader;
