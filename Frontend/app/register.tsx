import { View,Text } from "react-native";
import React, { useState } from "react";
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (
        <>
            <View className="flex justify-center items-center h-full">
                <Text className="">Register</Text>
            </View>
        </>
    );
}

export default Register;