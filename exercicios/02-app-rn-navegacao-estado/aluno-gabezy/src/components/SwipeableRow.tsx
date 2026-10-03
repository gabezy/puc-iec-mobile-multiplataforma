import type { ReactNode } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
};

const THRESHOLD_RATIO = 0.3;

export default function SwipeableRow({ children, onSwipeRight, onSwipeLeft }: Props) {
  const { width } = useWindowDimensions();
  const threshold = width * THRESHOLD_RATIO;
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    // Só ativa com movimento horizontal; vertical fica para o scroll da FlatList
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > threshold) {
        // Favoritar: card volta pro lugar
        runOnJS(onSwipeRight)();
        translateX.value = withSpring(0);
      } else if (translateX.value < -threshold) {
        // Descartar: card sai da tela antes de ser removido
        translateX.value = withTiming(-width, { duration: 200 }, (finished) => {
          if (finished) runOnJS(onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${interpolate(translateX.value, [-width, 0, width], [-8, 0, 8])}deg` },
    ],
  }));

  const favoriteHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, threshold], [0, 1], 'clamp'),
  }));

  const discardHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-threshold, 0], [1, 0], 'clamp'),
  }));

  return (
    <View>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.hint, styles.favorite, favoriteHintStyle]}>
          <Text style={styles.hintText}>❤️ Favoritar</Text>
        </Animated.View>
        <Animated.View style={[styles.hint, styles.discard, discardHintStyle]}>
          <Text style={styles.hintText}>🗑 Descartar</Text>
        </Animated.View>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, cardStyle]}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', paddingHorizontal: 20 },
  favorite: { backgroundColor: '#2e7d32', alignItems: 'flex-start' },
  discard: { backgroundColor: '#c62828', alignItems: 'flex-end' },
  hintText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  card: { backgroundColor: '#fff' },
});
