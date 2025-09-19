import type {PropsWithChildren, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedRef} from 'react-native-reanimated';

import {globalStyles} from '@/constants/globalStyles';
import {useThemeColor} from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: {dark: string; light: string}; // vẫn optional
}>;

export default function ParallaxScrollView({children, headerImage, headerBackgroundColor}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

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
