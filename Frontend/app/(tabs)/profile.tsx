import {View, Text, TouchableHighlight} from 'react-native';
import {Link} from 'expo-router';
import api from '../utils/api';
import { AuthContext } from '../store/authContext';
import { useContext } from 'react';

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


  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl">Profile</Text>
        <TouchableHighlight onPress={onPressLogout} className='border p-3 rounded-md'>
          <Text className="text-lg">Logout</Text>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default Profile;
