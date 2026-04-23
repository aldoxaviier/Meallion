import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Onboard = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Hero image */}
      <Image
        source={require("../assets/images/onboarding-hero.jpeg")}
        className="w-full flex-1"
        resizeMode="cover"
      />

      {/* Bottom sheet */}
      <View className="bg-white px-6 pt-6 pb-10 gap-3 rounded-t-3xl -mt-5">
        <TouchableOpacity
          onPress={() => router.push("/register")}
          className="bg-primary-500 rounded-full py-4 w-full"
        >
          <Text className="text-center text-white font-semibold text-base">
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-white border border-gray-300 rounded-full py-4 w-full"
        >
          <Text className="text-center text-black font-medium text-base">
            Sign in
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mt-1">
          By continuing, you agree to 7-Eleven's{"\n"}
          <Text className="underline">Privacy Policy</Text>
          {" and "}
          <Text className="underline">Terms of Use</Text>
        </Text>
      </View>
    </View>
  );
};

export default Onboard;