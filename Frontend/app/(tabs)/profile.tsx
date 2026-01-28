import {View, Text, TouchableHighlight} from 'react-native';
import {Link} from 'expo-router';
import api from '../utils/api';
import { AuthContext } from '../store/authContext';
import { useEffect, useState, useContext } from 'react';
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const onPressLogout = async () => {
    try {
      const response = await api.get('/auth/logout',);
      console.log("Logout response:", response.data);
      if (response.status === 200) {
        authContext?.logout();
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRefresh = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const response = await api.post('/auth/refresh',{ refreshToken });
      console.log("Profile response:", response.data);
      authContext?.setAccessToken(response.data.data.accessToken);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect (() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/getProfile')
                console.log(response.data.data)
            } catch (err : any) {
                console.log("get profile error:", err.response?.data || err.message);
            }
        }

        fetchProfile();
    }, [])

  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl">Profile</Text>
        <TouchableHighlight onPress={onPressLogout} className='border p-3 rounded-md'>
          <Text className="text-lg">Logout</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={handleRefresh} className='border p-3 rounded-md'>
          <Text className="text-lg">refresh</Text>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default Profile;
