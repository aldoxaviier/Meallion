import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Onboard = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Hero image + overlay */}
      <View className="flex-1">
        <Image
          source={require("../assets/images/onboarding-hero.jpeg")}
          className="w-full flex-1"
          resizeMode="cover"
        />

        <LinearGradient
          colors={["rgba(0,0,0,1)", "rgba(237,221,83,0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <Text className="text-white text-3xl font-fogsta">Meallion</Text>
          <Text className="text-white text-lg font-brsegma-600 mt-2">Your health, your taste, your perfect plate.</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View className="bg-white px-6 pt-6 pb-10 gap-3 rounded-t-3xl -mt-5">
        <TouchableOpacity
          onPress={() => router.push("/register")}
          className="bg-primary-500 rounded-full py-4 w-full"
        >
          <Text className="text-center text-white font-brsegma-600">
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-white border border-gray-300 rounded-full py-4 w-full"
        >
          <Text className="text-center text-black font-brsegma-600">
            Sign in
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mt-1">
          By continuing, you agree to Meallion's{"\n"}
          <Text className="underline">Privacy Policy</Text>
          {" and "}
          <Text className="underline">Terms of Use</Text>
        </Text>
      </View>
    </View>
  );
};

export default Onboard;