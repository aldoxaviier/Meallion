import React, { useEffect,useState } from 'react';
import { Dimensions, View, Text, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.6;
const SWIPE_THRESHOLD = width * 0.35;


type Props = {
  data: any;
  index: number;
  totalCards: number;
  onSwipeLeft: (id: number) => void;
  onSwipeRight: (id: number) => void;
};

export default function PreferenceCard({
  data,
  index,
  totalCards,
  onSwipeLeft,
  onSwipeRight,
}: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.5;
    })
    .onEnd((e) => {
      if (translateX.value > SWIPE_THRESHOLD) {
        // Swipe Right - Like
        translateX.value = withSpring(width + 200, { damping: 15 }, () => {
          runOnJS(onSwipeRight)(data.recipe_id);
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // Swipe Left - Dislike
        translateX.value = withSpring(-width - 200, { damping: 15 }, () => {
          runOnJS(onSwipeLeft)(data.recipe_id);
        });
      } else {
        // Return to center
        translateX.value = withSpring(0, );
        translateY.value = withSpring(0, );
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      zIndex: totalCards - index,
    };
  });

  useEffect(() => {
      const mapped = data.tags ? data.tags.split('|').map((tag: string) => tag.trim()) : [];
      setTagsArray(mapped);
  }, []);
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        style={[animatedCardStyle, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
        className="absolute rounded-3xl bg-white overflow-hidden"
      >
        <Image source={{ uri: data.Images }} className="w-full h-[70%]" resizeMode="cover" />
        {/* Card Info */}
        <View className="p-4">
          <Text className="text-2xl font-fogsta mb-2 text-primary-600">{data.name}</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {tagsArray.map((tag: string, idx: number) => (
              <View key={idx} className="bg-primary-500 px-2.5 py-1 rounded-xl">
                <Text className="text-secondary-400 text-xs font-brsegma-600">{tag}</Text>
              </View>
            ))}
          </View>
          <Text className="text-sm text-[#666] font-brsegma-500">🔥 {data.Calories} kcal</Text>
          <Text className="text-sm text-[#666] font-brsegma-500">⏱️ {data.CookTime}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}