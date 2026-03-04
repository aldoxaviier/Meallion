import { View, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useRef, useCallback } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Animated, { useSharedValue, useAnimatedStyle, interpolate, interpolateColor, SharedValue } from "react-native-reanimated";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

interface WheelPickerProps {
    data: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

interface AnimatedItemProps {
    item: string;
    index: number;
    scrollY: SharedValue<number>;
}

const AnimatedItem = ({ item, index, scrollY }: AnimatedItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        // Calculate how far this item is from the center selection
        const itemPosition = index * ITEM_HEIGHT;
        const distanceFromCenter = Math.abs(scrollY.value - itemPosition);
        
        // Interpolate opacity based on distance (0 = center, ITEM_HEIGHT*2 = far)
        const opacity = interpolate(
            distanceFromCenter,
            [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
            [1, 0.6, 0.3],
            'clamp'
        );

        // Interpolate scale for a nice depth effect
        const scale = interpolate(
            distanceFromCenter,
            [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
            [1, 0.95, 0.9],
            'clamp'
        );

        return {
            opacity,
            transform: [{ scale }],
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const itemPosition = index * ITEM_HEIGHT;
        const distanceFromCenter = Math.abs(scrollY.value - itemPosition);

        // Interpolate color from white (selected) to gray (not selected)
        const color = interpolateColor(
            distanceFromCenter,
            [0, ITEM_HEIGHT],
            ['#FFFFFF', '#9CA3AF'] // white to gray-400
        );

        return { color };
    });

    return (
        <Animated.View 
            style={[
                { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
                animatedStyle
            ]}
        >
            <Animated.Text
                className="text-lg font-brsegma-500"
                style={animatedTextStyle}
            >
                {item}
            </Animated.Text>
        </Animated.View>
    );
};

const WheelPicker = ({ data, selectedIndex, onSelect }: WheelPickerProps) => {
    const flatListRef = useRef<any>(null);
    const scrollY = useSharedValue(selectedIndex * ITEM_HEIGHT);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollY.value = event.nativeEvent.contentOffset.y;
    }, [scrollY]);

    const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        onSelect(clampedIndex);
    }, [data.length, onSelect]);

    const renderItem = useCallback(({ item, index }: { item: string; index: number }) => {
        return <AnimatedItem item={item} index={index} scrollY={scrollY} />;
    }, [scrollY]);

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    }), []);

    return (
        <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: 'hidden' }}>
            <BottomSheetFlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(_: string, index: number) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
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

export { WheelPicker, ITEM_HEIGHT, VISIBLE_ITEMS };
export type { WheelPickerProps };
