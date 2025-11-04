import { View,Text,TextInput,TouchableWithoutFeedback,Keyboard,TouchableHighlight,Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState,useContext,useRef,useEffect } from 'react';
import { RegisterContext } from '../store/registerContext';
import api from '../utils/api';
import { useRouter } from 'expo-router';
import { AuthContext } from '../store/authContext';
const otpduplicated = () => {
    const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const registerContext = useContext(RegisterContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [message, setMessage] = useState('');
    const authContext = useContext(AuthContext);

const handleOtpChange = (value: string, index: number) => {
  const numericValue = value.replace(/[^0-9]/g, '');

  if (numericValue.length > 1) {
    // Handle paste scenario
    const pastedValues = numericValue.slice(0, 6).split('');
    const newOtpValues = [...otpValues];
    pastedValues.forEach((digit, i) => {
      if (index + i < 6) newOtpValues[index + i] = digit;
    });
    setOtpValues(newOtpValues);
    const nextIndex = Math.min(index + pastedValues.length, 5);
    setTimeout(() => inputRefs.current[nextIndex]?.focus(), 50);
  } else if (numericValue) {
    // Single digit entry
    const newOtpValues = [...otpValues];
    newOtpValues[index] = numericValue;
    setOtpValues(newOtpValues);

    if (index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
    }
  } else {
    // Handle delete
    const newOtpValues = [...otpValues];
    newOtpValues[index] = '';
    setOtpValues(newOtpValues);
  }
};


    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otpValues[index] === '' && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };


    const handleContinue = async() => {
        setIsLoading(true);
        setMessage('');
        try {
            const otpString = otpValues.join('');
            const body = { 
                name: registerContext?.registerData.name,
                email: registerContext?.registerData.email, 
                password: registerContext?.registerData.password, 
                otp: otpString
            };
            console.log("body:", body);
            const response = await api.post(`/auth/register`, body);
            authContext?.login(response.data.data.accessToken, response.data.data.refreshToken);
            router.push('/(tabs)');
        } catch (error : any) {
            console.log(error.response.data);
            setMessage(error.response.data.message);
            setIsLoading(false);
        }
    }

    return (
        <>
        <SafeAreaView className='bg-secondary-400'>
            <View className="h-full bg-secondary-400 flex flex-col items-center py-2 ">
                <View className='flex flex-col gap-2 basis-[40vh] justify-center'>
                    <Text className="text-4xl text-primary-500 font-fogsta text-center">Enter OTP</Text>
                    <Text className="text-primary-500 font-brsegma-500 text-center">We have sent a One Time Password to your email</Text>
                </View>
                <View className='bg-white basis-[60vh] w-full rounded-t-[20px] flex flex-col gap-4 px-4 py-6'>
                    <View className='flex flex-row justify-center gap-2 my-4'>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                value={otpValues[index]}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                autoFocus={index === 0}
                                selectTextOnFocus
                                className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-brsegma-600 ${
                                    otpValues[index] ? 'border-primary-500' : 'border-gray-300'
                                }`}
                            />
                        ))}
                    </View>
                    <TouchableHighlight 
                        className='self-center'
                        underlayColor="transparent"
                    >
                        <Text className='text-gray-600 font-brsegma-500 text-sm'>
                            Didn't get a code?
                        </Text>
                    </TouchableHighlight>
                    {message ? (
                        <Text className="text-red-500 text-center text-sm font-brsegma-600">
                            {message}
                        </Text>
                    ) : null}
                    <TouchableHighlight 
                        className={`bg-primary-500 rounded-[40px] p-5 mt-4 ${isLoading || otpValues.some(val => !val) ? 'opacity-70' : ''}`}
                        onPress={handleContinue} 
                        disabled={isLoading || otpValues.some(val => !val)}
                    >
                        <Text className='text-white text-center font-brsegma-600'>
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaView>
        </>
    );
}

export default otpduplicated;