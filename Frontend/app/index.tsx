import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Onboard = () => {
  const router = useRouter();

  const handleSignUp = () => {
    // Navigate to sign up screen
    router.push("/register/" as any);
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
            Create an Account
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
        <TouchableOpacity 
          onPress={() => router.push("/register/profileonboard")}
          className="py-4 w-full border border-secondary-400 rounded-full bg-primary-500"
        >
          <Text className="text-center text-secondary-400 font-semibold text-lg">
            Profile Onboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push("/register/otp")
            
          }
          className="py-4 w-full border border-secondary-400 rounded-full bg-primary-500"
        >
          <Text className="text-center text-secondary-400 font-semibold text-lg">
            OTP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/profile")}
          className="py-4 w-full border border-secondary-400 rounded-full bg-primary-500"
        >
          <Text className="text-center text-secondary-400 font-semibold text-lg">
            test break
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push("/register/allergies")}
          className="py-4 w-full border border-secondary-400 rounded-full bg-primary-500"
        >
          <Text className="text-center text-secondary-400 font-semibold text-lg">
            test allergies
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboard;
