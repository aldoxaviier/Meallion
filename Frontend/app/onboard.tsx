import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Onboard = () => {
  const router = useRouter();

  const handleSignUp = () => {
    // Navigate to sign up screen
    router.push("/register");
  };

  const handleSignIn = () => {
    // Navigate to sign in screen
    router.push("/login");
  };

  return (
    <View className="bg-secondary-400 h-full w-full flex justify-center items-center">
      
      <View className="w-full px-6 pb-8 flex-col gap-2">
        <TouchableOpacity 
          onPress={handleSignUp}
          className="bg-white rounded-full py-4 w-full"
        >
          <Text className="text-center text-primary-500 font-semibold text-lg">
            Sign up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSignIn}
          className="py-4 w-full border border-secondary-400 rounded-full bg-primary-500"
        >
          <Text className="text-center text-secondary-400 font-semibold text-lg">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboard;
