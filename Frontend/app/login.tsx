import { useContext, useState } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { AuthContext } from './store/authContext';
import { api } from './utils/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const onPressLogin = async () => {
    setMessage('');
    setIsLoading(true);
    try {
      const body = { email, password };
      const response: any = await api.post(`/auth/login`, body);
      if (response.statusCode == 200) {
        if (response.data.hasProfile == false) {
          router.replace('/register/profileonboard');
        } else if (response.data.hasInteractions == false) {
          router.replace('/register/preference');
        } else {
          authContext?.login(
            response.data.accessToken,
            response.data.refreshToken
          );
        }
      }
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className='bg-secondary-300'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 8 }}
          >
            <Feather name="arrow-left" size={24} color="#1a1a1a" />
          </TouchableOpacity>

          {/* Header */}
          <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 36 }}>
            <Text
              className="font-fogsta"
              style={{
                fontSize: 32,
                color: '#7B1C1C',
                textAlign: 'center',
                lineHeight: 40,
              }}
            >
              Welcome Back,{'\n'}Healthy Friend!
            </Text>
          </View>

          {/* Subtitle */}
          <Text
            className="font-brsegma-500"
            style={{ color: '#7B1C1C', marginBottom: 16, fontSize: 14 }}
          >
            Sign in to continue
          </Text>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              className="font-brsegma-600"
              style={{ color: '#1a1a1a', marginBottom: 6, fontSize: 14 }}
            >
              Email
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              className="font-brsegma-500"
              style={{
                borderWidth: 1,
                borderColor: '#D1C4A8',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: '#1a1a1a',
                backgroundColor: '#FDFAF3',
              }}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 12 }}>
            <Text
              className="font-brsegma-600"
              style={{ color: '#1a1a1a', marginBottom: 6, fontSize: 14 }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#D1C4A8',
                borderRadius: 12,
                backgroundColor: '#FDFAF3',
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                value={password}
                className="font-brsegma-500"
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: '#1a1a1a',
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#7B1C1C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me + Forgot Password */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderColor: '#7B1C1C',
                  borderRadius: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: rememberMe ? '#7B1C1C' : 'transparent',
                }}
              >
                {rememberMe && <Feather name="check" size={12} color="white" />}
              </View>
              <Text className="font-brsegma-500" style={{ color: '#1a1a1a', fontSize: 13 }}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/forgotpassword")}>
              <Text className="font-brsegma-600" style={{ color: '#7B1C1C', fontSize: 13 }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableHighlight
            onPress={onPressLogin}
            underlayColor="#5C1515"
            style={{
              backgroundColor: '#7B1C1C',
              borderRadius: 50,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text
              className="font-brsegma-600"
              style={{ color: 'white', fontSize: 16, fontWeight: '600' }}
            >
              {isLoading ? 'Signing In...' : 'Continue'}
            </Text>
          </TouchableHighlight>

          {/* Error Message */}
          {message ? (
            <Text
              className="font-brsegma-600"
              style={{ color: '#ef4444', textAlign: 'center', marginBottom: 12, fontSize: 13 }}
            >
              {message}
            </Text>
          ) : null}

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text className="font-brsegma-500" style={{ color: '#6B7280' }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/register" replace>
              <Text className="font-brsegma-600" style={{ color: '#7B1C1C' }}>
                Sign Up
              </Text>
            </Link>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;