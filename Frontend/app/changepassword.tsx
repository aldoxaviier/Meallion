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
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from './utils/api';
import { ChangePasswordContext } from './store/changePasswordContext';

const Index = () => {
    const [name, setName] = useState('');
    const [passwordDummy, setPasswordDummy] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const cpcontext = useContext(ChangePasswordContext);

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            if(password !== passwordDummy) {
                setMessage("Passwords do not match");
                setIsLoading(false);
                return;
            }
            cpcontext?.setChangePasswordData({ email: cpcontext?.changePasswordData.email, password: password });
            const body = { email: cpcontext?.changePasswordData.email, password };
            const response = await api.post(`/auth/forgot-password`, body);
            router.push('/login');
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
                  placeholder="Password"
                  className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500  mt-4 text-black"
                  placeholderTextColor="#6B7280"
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  value={password}
                />

                <TextInput
                  placeholder="ConfirmPassword"
                  className="w-full border border-gray-400 rounded-xl px-4 py-4 font-brsegma-500 mt-4 text-black"
                  placeholderTextColor="#6B7280"
                  onChangeText={setPasswordDummy}
                  secureTextEntry={true}
                  value={passwordDummy}
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

export default Index;
