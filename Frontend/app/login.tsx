import { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { AuthContext } from './store/authContext';
import api from './utils/api';
import { useRouter } from 'expo-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const onPressLogin = async () => {
  setMessage('');
  setIsLoading(true);
  try {
    const body = { email, password };
    const response = await api.post(`/auth/login`, body);

    console.log('Login response:', response);

    if (response.status === 200) {
      authContext?.login(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );
    }
  } catch (error : any) {
    if (error.response) {
      console.error('Login error response:', error.response.data);
      setMessage(error.response.data.message);
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <SafeAreaView className='bg-white pt-6'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>       
          <View className="px-6 py-6 bg-white h-full w-full flex-col gap-2">
            <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            {/* Logo/Brand Section */}
            <View className="flex flex-col justify-start ">
              <Text className="text-4xl font-bold text-primary-400 font-fogsta">Log in</Text>
              <Text className="text-gray-600 font-brsegma-500">
                Please enter your credentials to continue
              </Text>
            </View>

            {/* Login Form */}
            <View className=" flex-col gap-4 ">
              {/* Email Input */}
              <View className="flex-col gap-1">
                <Text className="text-gray-700 font-brsegma-600">Email</Text>
                <TextInput placeholder='Enter your email' className='border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500' onChangeText={setEmail}/>
              </View>

              {/* Password Input */}
              <View className="flex-col gap-1">
                <Text className="text-gray-700 font-brsegma-600">Password</Text>
                <TextInput placeholder='Password' className='border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500' secureTextEntry onChangeText={setPassword}/>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="mb-6" activeOpacity={0.7}>
                <Text className="text-primary-400 font-medium text-right font-brsegma-600">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableHighlight
                onPress={onPressLogin}
                className={`bg-primary-400 rounded-xl py-4 items-center mb-6`}
              >
                <Text className="text-white font-brsegma-600 text-lg">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableHighlight>

              {/* Error Message */}
              {message ? (
                <Text className="text-red-500 text-center mb-4 text-sm font-brsegma-600">
                  {message}
                </Text>
              ) : null}

              {/* Sign Up Link */}
              <View className="flex-row justify-center">
                <Text className="text-gray-600 font-brsegma-500">Don't have an account? </Text>
                <Link href="/register/credentials" replace>
                  <Text className="text-primary-400 font-brsegma-600">Sign Up</Text>
                </Link>
              </View>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
