import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind'; 

interface CustomHeaderProps {
    title: string;
    onBackPress?: () => void;
}

const CustomHeader = ({ title, onBackPress }: CustomHeaderProps) => {
    const router = useRouter();
    const { colorScheme } = useColorScheme(); 

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    const iconColor = colorScheme === 'dark' ? '#FFF9E7' : '#660B05';

    return (
        <View className="flex-row items-center justify-between px-6 pt-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-surface-darker">
            <TouchableOpacity 
                onPress={handleBackPress}
                className="w-10 h-10 justify-center"
            >
                <Ionicons name="chevron-back" size={24} color={iconColor} />
            </TouchableOpacity>
            
            <Text className="text-lg font-fogsta text-primary-500 dark:text-secondary-400 text-center flex-1 mr-10">
                {title}
            </Text>
        </View>
    );
};

export default CustomHeader;