import { Stack } from "expo-router";
import { View, Text } from "react-native";
import CustomHeader from "../../components/CustomHeader";

export default function Notification() {
    return (
      <View className="flex-1 bg-secondary-400">
        <Stack.Screen 
          options={{ 
            headerShown: true,
            header: () => <CustomHeader title="Your Notifications" />
          }}
        />
      </View>
    )
}