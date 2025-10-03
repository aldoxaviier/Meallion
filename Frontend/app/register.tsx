import { View,Text,TextInput } from "react-native";
import React, { useState } from "react";
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        
    }
    return (
        <>
            <View className="flex justify-center items-center h-full">
                <Text className="">Register</Text>
                <TextInput className="" placeholder="Name" value={name} onChangeText={setName} />
                <TextInput className="" placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput className="" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput className="" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                
            </View>
        </>
    );
}

export default Register;