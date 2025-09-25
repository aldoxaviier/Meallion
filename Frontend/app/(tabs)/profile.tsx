import {View, Text, Pressable} from 'react-native';
import {Link} from 'expo-router';

const Profile = () => {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-blue-500">
        <Text className="text-5xl">Profile</Text>
        <Pressable onPress={() => console.log('Pressed!')}>
        <Text className="text-lg">Logout</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Profile;
