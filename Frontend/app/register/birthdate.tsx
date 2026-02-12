import { useState, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItemInfo,
} from 'react-native';
import { ProfileContext } from '../store/profileContext';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

interface WheelPickerProps {
  data: (string | number)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const WheelPicker = ({ data, selectedIndex, onSelect }: WheelPickerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const isScrolling = useRef(false);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    if (clampedIndex !== selectedIndex && !isScrolling.current) {
      onSelect(clampedIndex);
    }
  }, [data.length, selectedIndex, onSelect]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrolling.current = false;
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    onSelect(clampedIndex);
  }, [data.length, onSelect]);

  const handleScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
  }, []);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<string | number>) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          className={`text-lg font-brsegma-500 ${
            isSelected ? 'text-white' : 'text-gray-400'
          }`}
          style={{ opacity: isSelected ? 1 : 0.6 }}
        >
          {item}
        </Text>
      </View>
    );
  }, [selectedIndex]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: 'hidden' }}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialScrollIndex={selectedIndex}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        }}
      />
    </View>
  );
};

const Birthdate = () => {
  const [selectedMonth, setSelectedMonth] = useState(6); 
  const [selectedDay, setSelectedDay] = useState(25); 
  const [selectedYear, setSelectedYear] = useState(years.indexOf(2005)); 
  
  const [isLoading, setIsLoading] = useState(false);
  const profileContext = useContext(ProfileContext);
  const router = useRouter();
  
  const getSelectedDate = () => {
    const year = years[selectedYear];
    const month = selectedMonth;
    const day = days[selectedDay];
    return new Date(year, month, day);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const selectedDate = getSelectedDate();

      const today = new Date();
      const birthDate = new Date(selectedDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        Alert.alert(
          'Age Restriction', 
          'You must be at least 13 years old to use this app. Please check your birthdate.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      if (age > 120) {
        Alert.alert(
          'Invalid Date', 
          'Please enter a valid birthdate.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      await profileContext?.setProfileData({
        ...profileContext.profileData,
        birthdate: selectedDate,
      });

      router.push('/register/profile');
    } catch (error) {
      console.error('Error saving birthdate:', error);
      Alert.alert('Error', 'Failed to save birthdate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-secondary-400 flex-1">
        <View className="h-full w-full flex flex-col gap-4 px-6 py-6">
            <TouchableOpacity className="self-start pr-2 py-2 rounded-lg" onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <View className="flex flex-row gap-1 mb-4">
                <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                <View className="h-1 flex-1 bg-primary-500 rounded-full"></View>
                <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
                <View className="h-1 flex-1 bg-gray-400 rounded-full"></View>
            </View>
            <View className="flex flex-col justify-between flex-1">
                <View className="flex flex-col gap-8">
                    <Text className="text-4xl font-fogsta text-primary-500 text-center">When is your birthdate?</Text>
                    <Text className="text-center font-brsegma-500 text-base text-gray-600">We'll use this to personalize your experience</Text>
                    
                    {/* Custom Date Picker */}
                    <View className="items-center justify-center mt-8">
                        {/* Selection highlight - green pill */}
                        <View 
                            className="absolute bg-primary-500 rounded-full z-0"
                            style={{ 
                                height: ITEM_HEIGHT, 
                                width: '85%',
                                top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                            }}
                        />
                        
                        {/* Wheel pickers row */}
                        <View className="flex-row justify-center z-10" style={{ width: '85%' }}>
                            <View style={{ flex: 1 }}>
                                <WheelPicker
                                    data={months}
                                    selectedIndex={selectedMonth}
                                    onSelect={setSelectedMonth}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <WheelPicker
                                    data={days}
                                    selectedIndex={selectedDay}
                                    onSelect={setSelectedDay}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <WheelPicker
                                    data={years}
                                    selectedIndex={selectedYear}
                                    onSelect={setSelectedYear}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity 
                    className={`py-4 px-10 self-center rounded-full ${isLoading ? 'bg-gray-400' : 'bg-primary-500'}`}
                    onPress={handleContinue}
                    disabled={isLoading}
                >
                    <Text className="text-center font-brsegma-600 text-secondary-400">
                        {isLoading ? 'Loading...' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
};

export default Birthdate;