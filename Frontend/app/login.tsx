import { Pressable, Text, TextInput, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './store/authContext';
import api from './utils/api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  useEffect(() => {
      console.log(email);
  },[email])

  const onPressLogin = async () => {
    try {
      const body = { email, password };
      const response = await api.post(`/auth/login`, body);

      if (response.status === 200) {
        console.log("access:",response.data.accessToken);
        authContext?.login(response.data.data.accessToken);
      }

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
      <>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl font-bold'>Login Screen</Text>
        <TextInput placeholder='Email' value={email} onChangeText={setEmail} className='border w-80 px-2 py-4'/>
        <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} className='border w-80 px-2 py-4'/>
        <Pressable onPress={() => {onPressLogin()}} className='bg-blue-500 p-3 rounded-md'>
          <Text>Login</Text>
        </Pressable>
      </View>
      </>
  );
}

export default Login;
