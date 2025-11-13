import { View,Text,TextInput,TouchableWithoutFeedback,Keyboard,TouchableHighlight,Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState,useContext,useRef,useEffect } from 'react';
import { RegisterContext } from '../store/registerContext';
import api from '../utils/api';
import { useRouter } from 'expo-router';
import { AuthContext } from '../store/authContext';
import { Ionicons } from '@expo/vector-icons';
const otpduplicated = () => {
    const [otpValue, setOtpValue] = useState('');
    const hiddenInputRef = useRef<any>(null);
    const registerContext = useContext(RegisterContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [message, setMessage] = useState('');
    const authContext = useContext(AuthContext);

    const handleOtpChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtpValue(numericValue);
    };

    const focusInput = () => {
        hiddenInputRef?.current?.focus();
    };


    const handleContinue = async() => {
        setIsLoading(true);
        setMessage('');
        try {
            const body = { 
                name: registerContext?.registerData.name,
                email: registerContext?.registerData.email, 
                password: registerContext?.registerData.password, 
                otp: otpValue
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

    const maskEmail = (email : string) => {
        const [name, domain] = email.split('@');
        if (name.length <= 2) {
            return name[0] + '******@' + domain;
        }
        return name[0] + '******' + name[name.length - 1] + '@' + domain;
    }

    useEffect(() => {
        if (otpValue.length === 6) {
            Keyboard.dismiss();
            hiddenInputRef?.current?.blur();
        }
    }, [otpValue]);

    const handleResend = async() => {
        setIsLoading(true);
        setMessage('');
        try {
            const body = { email: registerContext?.registerData.email };
            await api.post(`/auth/sendOTP`, body);
            // start 2-minute countdown after successful resend
            setResendTimer(120);
        } catch (error : any) {
            console.log(error.response.data);
            setMessage(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Resend timer (in seconds). Start at 120 (2 minutes) so the resend button
    // is disabled immediately when user lands on this screen (OTP was sent
    // during registration flow).
    const [resendTimer, setResendTimer] = useState<number>(120);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [resendTimer]);

    return (
        <>
        <SafeAreaView className='bg-secondary-200'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="h-full bg-secondary-200 flex flex-col px-6 pb-6">
                {/* Back Button */}
                <TouchableHighlight 
                    className='w-10 h-10 mb-8'
                    underlayColor="#f3f4f6"
                    onPress={() => router.back()}
                >
                    <View className='w-10 h-10 items-center justify-center'>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </View>
                </TouchableHighlight>

                {/* Header Section */}
                <View className='flex flex-col gap-3 mb-8 justify-center items-center'>
                    <Text className="text-4xl font-fogsta text-primary-500">Verify Account</Text>
                    <Text className=" text-gray-600 font-brsegma-500">
                        Enter the one time code we sent to
                    </Text>
                    <Text className=" text-gray-600 font-brsegma-500">
                        {maskEmail(registerContext?.registerData.email || '')}
                    </Text>
                </View>

                {/* OTP Input Section */}
                <View className='flex-1 flex-col relative w-full items-center'>
                    <TextInput
                        ref={hiddenInputRef}
                        value={otpValue}
                        onChangeText={handleOtpChange}
                        keyboardType="number-pad"
                        maxLength={6}
                        className='absolute opacity-0 '
                        autoFocus
                    />
                    <Pressable onPress={focusInput}>
                        <View className='flex flex-row justify-center gap-3 mb-6'>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <View
                                    key={index}
                                    className={`w-14 h-16 border rounded-xl flex items-center justify-center ${
                                        otpValue.length === index ? 'border-primary-500 border-[3px]' : 'border-gray-600'
                                    }`}
                                >
                                    <Text className='text-2xl font-brsegma-600 text-black'>
                                        {otpValue[index] || ''}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Pressable>
                
                    <View className='flex-row items-center gap-3'>
                        {/* <Text className='text-gray-800 font-brsegma-500 text-sm'>
                            Didn't get a code?
                        </Text> */}
                        <Pressable onPress={handleResend} disabled={isLoading || resendTimer > 0}>
                            <Text className={`${isLoading || resendTimer > 0 ? 'text-gray-400' : 'text-primary-500'} font-brsegma-600 text-sm`}>
                                {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : 'Resend'}
                            </Text>
                        </Pressable>
                    </View>

                    {message ? (
                        <Text className="text-red-500 text-center text-sm font-brsegma-600 mb-4">
                            {message}
                        </Text>
                    ) : null}
                </View>

                {/* Continue Button at Bottom */}
                <View>
                    <TouchableHighlight 
                        className={`bg-primary-500 rounded-full py-5 ${isLoading || otpValue.length < 6 ? 'opacity-50' : ''}`}
                        onPress={handleContinue} 
                        disabled={isLoading || otpValue.length < 6}
                        underlayColor="#1f1f1f"
                    >
                        <Text className='text-white text-center font-brsegma-600 text-base'>
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
        </>
    );
}

export default otpduplicated;