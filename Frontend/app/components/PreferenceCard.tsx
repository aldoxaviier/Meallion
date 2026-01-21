import React from 'react';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';
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
const CARD_HEIGHT = height * 0.5;
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

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Image source={{ uri: data.Images }} style={styles.image} />

        {/* Card Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{data.name}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.tags}</Text>
            </View>
            <Text style={styles.details}>🔥 {data.Calories} kcal</Text>
            <Text style={styles.details}>⏱️ {data.CookTime}</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});
