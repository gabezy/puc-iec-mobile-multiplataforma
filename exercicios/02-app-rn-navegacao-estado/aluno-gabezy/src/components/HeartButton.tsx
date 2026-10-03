import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

type Props = {
    active: boolean;
    onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {

    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    }));

    return (
        <Pressable onPress={() => {
            scale.value = withSequence(withSpring(1.4), withSpring(1));
            rotation.value = withSequence(
                withTiming(-15, { duration: 80 }),
                withTiming(15, { duration: 120 }),
                withSpring(0),
            );
            onPress();
        }}>
            <Animated.Text style={[{ fontSize: 24 }, style]}>{active ? '❤️' : '🤍'}</Animated.Text>
        </Pressable>
    );
}
