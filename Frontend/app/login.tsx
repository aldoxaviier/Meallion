import { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { AuthContext } from './store/authContext';
import api from './utils/api';

const MAROON_PRIMARY = '#8b102a';
const MAROON_DARK = '#2b0010';
const MAROON_MUTED = '#b3261e';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const onPressLogin = async () => {
    setMessage('');
    setIsLoading(true);

    try {
      const body = { email, password };
      const response = await api.post(`/auth/login`, body);

      if (response.status === 200) {
        authContext?.login(response.data.data.accessToken, response.data.data.refreshToken);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: MAROON_DARK }}>
      <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} >
          <View className="flex-1 px-6 pt-14 pb-10">

            <View className="items-center mb-12">
              <View
                className="h-16 w-16 items-center justify-center rounded-3xl"
                style={{ backgroundColor: `${MAROON_PRIMARY}dd`, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 20 }}
              >
                <Text className="text-3xl font-bold text-white">M</Text>
              </View>
              <Text className="mt-6 text-3xl font-semibold text-white">Welcome Back</Text>
              <Text className="mt-2 text-center text-base text-white/70">
                Sign in to continue exploring curated meals crafted around your taste.
              </Text>
            </View>

            <View
              className="rounded-3xl px-6 py-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.96)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
                elevation: 18,
              }}
            >
              <View className="mb-6">
                <Text className="mb-2 font-semibold" style={{ color: MAROON_DARK }}>
                  Email
                </Text>
                <TextInput
                  className="rounded-2xl px-4 py-3 text-base"
                  placeholder="you@example.com"
                  placeholderTextColor="#a16879"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  style={{ borderWidth: 1, borderColor: `${MAROON_PRIMARY}33`, color: MAROON_DARK }}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 font-semibold" style={{ color: MAROON_DARK }}>
                  Password
                </Text>
                <TextInput
                  className="rounded-2xl px-4 py-3 text-base"
                  placeholder="••••••••"
                  placeholderTextColor="#a16879"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textContentType="password"
                  style={{ borderWidth: 1, borderColor: `${MAROON_PRIMARY}33`, color: MAROON_DARK }}
                />
              </View>

              <TouchableOpacity className="ml-auto">
                <Text className="text-sm font-semibold" style={{ color: MAROON_PRIMARY }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              {message ? (
                <Text className="mt-4 text-center text-sm" style={{ color: MAROON_MUTED }}>
                  {message}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={onPressLogin}
                disabled={isLoading}
                className="mt-8 rounded-2xl py-4 items-center"
                style={{ backgroundColor: MAROON_PRIMARY, opacity: isLoading ? 0.6 : 1 }}
                activeOpacity={0.85}
              >
                <Text className="text-base font-semibold text-white">
                  {isLoading ? 'Signing you in…' : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-10 items-center">
              <Text className="text-sm text-white/70">
                Don’t have an account?{' '}
                <Link href="/register" className="font-semibold" style={{ color: MAROON_MUTED }}>
                  Create one now
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
