import type {PropsWithChildren, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import {globalStyles} from '@/constants/globalStyles';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {useThemeColor} from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: {dark: string; light: string}; // vẫn optional
}>;

export default function ParallaxScrollView({children, headerImage, headerBackgroundColor}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{backgroundColor, flex: 1}}
      scrollEventThrottle={16}>
      <View style={[globalStyles.container]}>{children}</View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({});
