import { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { RegisterContext } from '../store/registerContext';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import {api} from '../utils/api';

const Credentials = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const registerContext = useContext(RegisterContext);
  const router = useRouter();

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      registerContext?.setRegisterData({ name: name, email: email, password: password });
      const body = { email };
      const response = await api.post(`/auth/sendOTP`, body);
      router.push('/register/otp');
      setIsLoading(false);
    } catch (error : any) {
      console.error(error.response.data);
      setMessage(error.response.data.message);
    }finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-secondary-400">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-secondary-400 px-6 pb-6">
            <View className="pt-6">
              <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-1 pt-2 items-center">
              <Text className="text-4xl font-fogsta text-primary-500 text-center">
                What's your name?
              </Text>
              <Text className="text-sm text-gray-500 font-brsegma-300 mt-2 text-center">
                Personalize your experience
              </Text>

              <View className="w-full mt-8 items-center">
                <TextInput
                  placeholder="First name"
                  className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500"
                  onChangeText={setName}
                  value={name}
                />

                <TextInput
                  placeholder="Email"
                  className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500  mt-4"
                  onChangeText={setEmail}
                  value={email}
                />

                <TextInput
                  placeholder="Password"
                  className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500 mt-4"
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  value={password}
                />
              </View>
            </View>

            <View className="pb-6 px-6">
              <TouchableOpacity
                className="bg-primary-500 rounded-[40px] p-4"
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-brsegma-600">
                  {isLoading ? 'Loading...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Credentials;
