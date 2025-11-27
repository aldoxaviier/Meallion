import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 450;
const SNAP_POINTS = [-width - 150, 0, width + 150];

type Props = {
  children?: React.ReactNode;
  style?: any;
  onSwipeEnd?: (dest: number) => void;
};

export default function PreferenceCard({ children, style, onSwipeEnd }: Props) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const dest = snapPoint(translateX.value, e.velocityX, SNAP_POINTS);
      translateX.value = withSpring(dest, { damping: 100 });
      if (onSwipeEnd) onSwipeEnd(dest);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = `${translateX.value / 50}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
        <View className='flex-1 justify-center items-center'>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.card, style, animatedStyle]}>
                {children}
                </Animated.View>
            </GestureDetector>
        </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#ff7f50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
