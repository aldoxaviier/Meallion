import { Text, TouchableHighlight, View } from "react-native";
import api from "../utils/api";

export default function Index() {

  const onPressTest = async () => {
    try {
      const response = await api.get('/profile/test'); 
      console.log("Test response:", response.data); 
    } catch (error) {
      console.error("Error during test request:", error);
    }
  }

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableHighlight onPress={onPressTest} className='border p-3 rounded-md'>
        <Text className="text-lg">Test</Text>
      </TouchableHighlight>
    </View>
  );
}
