import { View,Text,TextInput, SafeAreaView,TouchableWithoutFeedback,Keyboard,TouchableHighlight } from 'react-native';
import { useState,useContext } from 'react';
import { RegisterContext } from '../store/registerContext';
import api from '../utils/api';
const otp = () => {
    const [otp, setOtp] = useState('');
    const registerContext = useContext(RegisterContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async() => {
        setIsLoading(true);
        try {
            const body = { 
                name: registerContext?.registerData.name,
                email: registerContext?.registerData.email, 
                password: registerContext?.registerData.password, 
                otp 
            };
            const response = await api.post(`/auth/register`, body);
            
        } catch (error) {
            
        }
    }

    return (
        <>
            <SafeAreaView className='bg-secondary-400'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="h-full bg-secondary-400 flex flex-col items-center py-2 ">
                    <View className='flex flex-col gap-2 basis-[40vh] justify-center'>
                        <Text className="text-4xl text-primary-500 font-fogsta text-center">Enter OTP</Text>
                        <Text className="text-primary-500 font-brsegma-500 text-center">We have sent a One Time Password to your email</Text>
                    </View>
                    <View className='bg-white basis-[60vh] w-full rounded-t-[20px] flex flex-col gap-4 px-4 py-6'>
                        <TextInput placeholder='OTP' className='border rounded-xl border-gray-300 px-4 py-4 font-brsegma-500' />
                        <TouchableHighlight className='bg-primary-500 rounded-[40px] p-5'>
                            <Text className='text-white text-center font-brsegma-600'>Verify</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    );
}

export default otp;