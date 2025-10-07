import { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import api from '../utils/api';
import { RegisterContext } from '../store/registerContext';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const Credentials = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const registerContext = useContext(RegisterContext);
  const router = useRouter();

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      registerContext?.setRegisterData({ name, email, password });
      const body = { email };
      const response = await api.post(`/auth/sendOTP`, body);
      console.log(response.data);
      router.push('/register/otp');
      setIsLoading(false);
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-secondary-400">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-secondary-400 flex-col items-center">
            {/* Header Section */}
            <View className="flex flex-col gap-2 flex-[2] px-6 py-6 items-center">
              <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-4xl text-primary-500 font-fogsta">
                    Let's get you started
                </Text>
                <Text className="text-primary-500 font-brsegma-500 text-center">
                    Create account to personalized your recommendations
                </Text>
            </View>

            {/* Form Section */}
            <View className="bg-white flex-[3] w-full rounded-t-[20px] flex flex-col gap-4 px-4 py-6">
              <TextInput
                placeholder="Name"
                className="border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500"
                onChangeText={setName}
              />
              <TextInput
                placeholder="Email"
                className="border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500"
                onChangeText={setEmail}
              />
              <View>
                <TextInput
                  placeholder="Password"
                  className="border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                <Text className="px-4 font-brsegma-300 text-sm text-gray-500">
                  6 characters minimum
                </Text>
              </View>

              <TouchableHighlight
                className="bg-primary-500 rounded-[40px] p-5"
                onPress={handleContinue}
                underlayColor="#500902"
              >
                <Text className="text-white text-center font-brsegma-600">
                  {isLoading ? 'Loading...' : 'Continue'}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                className="bg-primary-500 rounded-[40px] p-5"
                underlayColor="#500902"
                onPress={() => router.push('/register/profileonboard')}
              >
                <Text className="text-white text-center font-brsegma-600">
                  profile onboard
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Credentials;
