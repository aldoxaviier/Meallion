import { View,Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

function MyTabBar({ state, descriptors, navigation }:any) {

    const getIcon = (routeName: string) => {
        switch (routeName) {
            case 'index':
                return <AntDesign name="home" size={24} color="black" />;
            case 'profile':
                return <FontAwesome name="user-o" size={24} color="black" />;
            case 'saved':
                //return <AntDesign name="hearto" size={24} color="black" />;
                return <Text>halo</Text>;
            default:
                return <Ionicons name="search-outline" size={24} color="black" />;
        }
    }

  return (
    <View className="absolute flex flex-row justify-between bottom-[50px] w-[80%] self-center py-[10px] px-[20px]  rounded-[40px] overflow-hidden">
      {state.routes.map((route:any, index:any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable className='p-1'
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Text className='text-lg'>
              {getIcon(route.name)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default MyTabBar;